import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { DispensingGame, PHASES } from "../domain/game-engine.js";
import { paracetamolSuspensionMission as mission } from "../domain/formulations.js";

const canvas = document.querySelector("#lab");
const objective = document.querySelector("#objective");
const health = document.querySelector("#health");
const score = document.querySelector("#score");
const status = document.querySelector("#status");
const actions = document.querySelector("#actions");
const panel = document.querySelector("#mission-panel");
const title = document.querySelector("#mission-title");
const copy = document.querySelector("#mission-copy");
const game = new DispensingGame(mission);

title.textContent = mission.title;
copy.textContent = `${mission.patient.condition}. Enter the chamber, identify the safe materials, reject the contaminant, and complete the simulated dispensing workflow.`;
objective.textContent = mission.learningObjectives.join(" • ");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(render);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050914);
scene.fog = new THREE.FogExp2(0x050914, 0.045);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 4.2, 10);

scene.add(new THREE.HemisphereLight(0xaadfff, 0x14213d, 2.2));
const key = new THREE.PointLight(0x58f5ca, 60, 24);
key.position.set(0, 5, 2);
scene.add(key);

const chamber = new THREE.Mesh(
  new THREE.CylinderGeometry(7, 7, 7, 32, 1, true),
  new THREE.MeshStandardMaterial({ color: 0x18304c, transparent: true, opacity: 0.24, side: THREE.BackSide })
);
chamber.position.y = 2.5;
scene.add(chamber);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(7, 64),
  new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.65, roughness: 0.35 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const ingredientMeshes = [];
mission.ingredients.forEach((ingredient, index) => {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.48, 2),
    new THREE.MeshStandardMaterial({
      color: ingredient.color,
      emissive: ingredient.color,
      emissiveIntensity: ingredient.hazard ? 0.9 : 0.28,
      metalness: 0.2,
      roughness: 0.28,
    })
  );
  const electron = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.025, 8, 48),
    new THREE.MeshBasicMaterial({ color: ingredient.color, transparent: true, opacity: 0.72 })
  );
  electron.rotation.x = index * 0.7;
  group.add(core, electron);
  const angle = (index / mission.ingredients.length) * Math.PI * 2;
  group.position.set(Math.cos(angle) * 4.3, 1.4 + (index % 2) * 1.35, Math.sin(angle) * 3.1);
  group.userData = { ingredient, baseY: group.position.y, offset: index };
  ingredientMeshes.push(group);
  scene.add(group);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
canvas.addEventListener("pointerdown", (event) => {
  if (game.phase !== PHASES.SELECTING) return;
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(ingredientMeshes, true);
  if (!hits.length) return;
  const group = ingredientMeshes.find((candidate) => candidate === hits[0].object.parent || candidate === hits[0].object);
  if (!group) return;
  const state = game.selectIngredient(group.userData.ingredient.id);
  if (!state.error && state.phase !== PHASES.FAILED) group.visible = false;
  update(state, group.userData.ingredient.label);
});

document.querySelector("#begin").addEventListener("click", () => {
  panel.hidden = true;
  update(game.begin());
});
document.querySelector("#restart").addEventListener("click", reset);

function reset() {
  ingredientMeshes.forEach((mesh) => { mesh.visible = true; });
  panel.hidden = false;
  document.body.classList.remove("failed", "complete");
  update(game.reset());
}

function update(state, selectedLabel = "") {
  health.value = state.health;
  score.textContent = `Score ${state.score}`;
  actions.replaceChildren();

  if (state.error) status.textContent = state.error;
  else if (state.phase === PHASES.SELECTING) status.textContent = selectedLabel ? `${selectedLabel} accepted. Select the next material.` : "Select the floating materials in the safe workflow order.";
  else if (state.phase === PHASES.COMPOUNDING) status.textContent = "Materials secured. Complete the dispensing operations.";
  else if (state.phase === PHASES.COMPLETE) {
    status.textContent = "Mission passed. The preparation cleared the training checks and the patient avatar recovered.";
    document.body.classList.add("complete");
  } else if (state.phase === PHASES.FAILED) {
    status.textContent = "Mission failed. The contaminant entered the preparation. The avatar has collapsed.";
    document.body.classList.add("failed");
  }

  if (state.phase === PHASES.COMPOUNDING) {
    mission.compoundingSteps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = step.label;
      button.disabled = index < state.stepIndex;
      button.addEventListener("click", () => update(game.performStep(step.id)));
      actions.append(button);
    });
  }
}

function render(time) {
  const seconds = time * 0.001;
  ingredientMeshes.forEach((mesh) => {
    mesh.rotation.y += 0.006;
    mesh.rotation.x = Math.sin(seconds * 0.7 + mesh.userData.offset) * 0.18;
    mesh.position.y = mesh.userData.baseY + Math.sin(seconds + mesh.userData.offset) * 0.22;
  });
  camera.position.x = Math.sin(seconds * 0.08) * 1.4;
  camera.lookAt(0, 1.4, 0);
  renderer.render(scene, camera);
}

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

update(game.snapshot());
