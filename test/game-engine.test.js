import test from "node:test";
import assert from "node:assert/strict";
import { DispensingGame, PHASES } from "../src/domain/game-engine.js";
import { paracetamolSuspensionMission as mission } from "../src/domain/formulations.js";

test("a safe complete run reaches recovery", () => {
  const game = new DispensingGame(mission);
  game.begin();
  mission.selectionOrder.forEach((id) => game.selectIngredient(id));
  mission.compoundingSteps.forEach(({ id }) => game.performStep(id));
  assert.equal(game.phase, PHASES.COMPLETE);
  assert.equal(game.health, 100);
  assert.ok(game.score >= 1000);
});

test("the contaminant immediately fails the mission", () => {
  const game = new DispensingGame(mission);
  game.begin();
  const state = game.selectIngredient("poison");
  assert.equal(state.phase, PHASES.FAILED);
  assert.equal(state.health, 0);
});

test("out-of-order material is rejected without advancing", () => {
  const game = new DispensingGame(mission);
  game.begin();
  const state = game.selectIngredient("vehicle");
  assert.equal(state.selectionIndex, 0);
  assert.match(state.error, /Sequence rejected/);
});
