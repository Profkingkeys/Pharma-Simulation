const PHASES = Object.freeze({
  BRIEFING: "briefing",
  SELECTING: "selecting",
  COMPOUNDING: "compounding",
  COMPLETE: "complete",
  FAILED: "failed",
});

export class DispensingGame {
  constructor(mission) {
    this.mission = mission;
    this.reset();
  }

  reset() {
    this.phase = PHASES.BRIEFING;
    this.selectionIndex = 0;
    this.stepIndex = 0;
    this.score = 0;
    this.health = this.mission.patient.initialHealth;
    this.events = [];
    return this.snapshot();
  }

  begin() {
    this.#require(PHASES.BRIEFING);
    this.phase = PHASES.SELECTING;
    this.score += 100;
    this.#record("prescription_verified");
    return this.snapshot();
  }

  selectIngredient(id) {
    this.#require(PHASES.SELECTING);
    const ingredient = this.mission.ingredients.find((item) => item.id === id);
    if (!ingredient) throw new Error(`Unknown ingredient: ${id}`);

    if (ingredient.hazard) {
      this.phase = PHASES.FAILED;
      this.health = 0;
      this.score = Math.max(0, this.score - 100);
      this.#record("contaminant_selected", { id });
      return this.snapshot();
    }

    const expected = this.mission.selectionOrder[this.selectionIndex];
    if (id !== expected) {
      this.score = Math.max(0, this.score - 20);
      this.#record("selection_rejected", { id, expected });
      return this.snapshot({ error: `Sequence rejected. Expected ${expected}.` });
    }

    this.selectionIndex += 1;
    this.score += 60;
    this.#record("ingredient_selected", { id });
    if (this.selectionIndex === this.mission.selectionOrder.length) {
      this.phase = PHASES.COMPOUNDING;
    }
    return this.snapshot();
  }

  performStep(id) {
    this.#require(PHASES.COMPOUNDING);
    const expected = this.mission.compoundingSteps[this.stepIndex];
    if (id !== expected.id) {
      this.score = Math.max(0, this.score - 25);
      this.#record("step_rejected", { id, expected: expected.id });
      return this.snapshot({ error: `Incorrect next operation. Review the workflow.` });
    }

    this.stepIndex += 1;
    this.score += 90;
    this.health = Math.min(100, this.health + 8);
    this.#record("step_completed", { id });
    if (this.stepIndex === this.mission.compoundingSteps.length) {
      this.phase = PHASES.COMPLETE;
      this.health = 100;
      this.score += 250;
      this.#record("mission_completed");
    }
    return this.snapshot();
  }

  snapshot(extra = {}) {
    return Object.freeze({
      phase: this.phase,
      selectionIndex: this.selectionIndex,
      stepIndex: this.stepIndex,
      score: this.score,
      health: this.health,
      nextIngredient: this.mission.selectionOrder[this.selectionIndex] ?? null,
      nextStep: this.mission.compoundingSteps[this.stepIndex] ?? null,
      ...extra,
    });
  }

  #require(expected) {
    if (this.phase !== expected) throw new Error(`Action unavailable during ${this.phase}.`);
  }

  #record(type, payload = {}) {
    this.events.push({ type, payload, sequence: this.events.length + 1 });
  }
}

export { PHASES };
