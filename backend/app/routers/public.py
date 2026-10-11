"""Public (unauthenticated) endpoints for shared roasts: JSON view, OG card and share page."""

from fastapi import APIRouter, Depends, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.responses import HTMLResponse, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.rate_limit import limiter
from app.schemas.public import PublicRoastResponse
from app.services import card_service, share_service

router = APIRouter(prefix="/public", tags=["public"])


@router.get("/roasts/{share_slug}", response_model=PublicRoastResponse)
@limiter.limit("60/minute")
async def get_public_roast(
    request: Request,
    share_slug: str,
    db: Session = Depends(get_db),
) -> PublicRoastResponse:
    """Privacy-safe public view of a shared roast (404 unless public and completed)."""
    roast = share_service.get_public_roast(db, share_slug)
    return share_service.to_public_response(roast)


@router.get(
    "/roasts/{share_slug}/card.png",
    response_class=Response,
    responses={200: {"content": {"image/png": {}}}},
)
@limiter.limit("60/minute")
async def get_roast_card(
    request: Request,
    share_slug: str,
    db: Session = Depends(get_db),
) -> Response:
    """1200x630 PNG Open Graph card for a shared roast."""
    roast = share_service.get_public_roast(db, share_slug)
    data = card_service.card_data_from_roast(roast)
    png = await run_in_threadpool(card_service.get_card_png, data)
    return Response(
        content=png,
        media_type="image/png",
        headers={"Cache-Control": "public, max-age=3600"},
    )


@router.get("/share/{share_slug}", response_class=HTMLResponse)
@limiter.limit("60/minute")
async def get_share_page(
    request: Request,
    share_slug: str,
    db: Session = Depends(get_db),
) -> HTMLResponse:
    """OG-tagged HTML for social crawlers; redirects browsers to the SPA's /r/{slug}."""
    roast = share_service.find_public_roast(db, share_slug)
    if roast is None:
        return HTMLResponse(share_service.render_not_found_html(), status_code=404)
    return HTMLResponse(
        share_service.render_share_html(roast),
        headers={"Cache-Control": "public, max-age=300"},
    )
