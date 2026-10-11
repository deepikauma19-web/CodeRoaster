"""LLM prompt templates: base prompt + one TONE block per roast intensity."""

from app.models.roast import RoastIntensity
from app.services.prompts import extra_spicy, medium, mild
from app.services.prompts.base import BASE_PROMPT

TONES: dict[RoastIntensity, str] = {
    RoastIntensity.mild: mild.TONE,
    RoastIntensity.medium: medium.TONE,
    RoastIntensity.extra_spicy: extra_spicy.TONE,
}


def build_system_prompt(intensity: RoastIntensity) -> str:
    """Base prompt (rubric, safety, injection guard) + the tone block for `intensity`."""
    return f"{BASE_PROMPT}\n{TONES[RoastIntensity(intensity)]}"


__all__ = ["BASE_PROMPT", "TONES", "build_system_prompt"]
