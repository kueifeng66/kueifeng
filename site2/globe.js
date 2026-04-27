function getVectorFromLatLon(lat, lon, radius) {
  
  const phi = THREE.MathUtils.degToRad(90 - lat);   // latitude
  const theta = THREE.MathUtils.degToRad(90 + lon); // longitude

  return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
}


function smoothRotateTo(lat, lon) {
  if (!earth) return;

  isAutoRotating = false;

  const duration = 2000;
  const startQuat = earth.quaternion.clone();

  // Save current camera zoom position
  const startCameraZ = camera.position.z;
  const targetCameraZ = 2.5; // smaller = closer zoom in

  // Step 1: Rotate so the target lat/lon faces the camera (toward +Z)
  const targetPosition = getVectorFromLatLon(lat, lon, 1).normalize();
  const faceQuat = new THREE.Quaternion();
  faceQuat.setFromUnitVectors(targetPosition, new THREE.Vector3(0, 0, 1));

  // Step 2: After faceQuat is applied, figure out where the North Pole ends up
  const northPole = new THREE.Vector3(0, 1, 0); // geographic north in model space
  const rotatedNorth = northPole.clone().applyQuaternion(faceQuat);

  // Step 3: Project rotatedNorth onto the screen plane (XY plane, ignore Z)
  // and compute the roll needed to bring it upright (pointing toward +Y)
  const projectedNorth = new THREE.Vector2(rotatedNorth.x, rotatedNorth.y).normalize();
  const upVector = new THREE.Vector2(0, 1);
  const angle = Math.atan2(projectedNorth.x, projectedNorth.y); // signed roll angle

  // Step 4: Build a roll correction around the Z axis (camera-facing axis)
  const rollQuat = new THREE.Quaternion();
  rollQuat.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);

  // Step 5: Compose: first face the location, then roll north upright
  const targetQuat = rollQuat.multiply(faceQuat);

  new TWEEN.Tween({ t: 0, z: startCameraZ })
    .to({ t: 1, z: targetCameraZ }, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate((obj) => {
      earth.quaternion.slerpQuaternions(startQuat, targetQuat, obj.t);
      camera.position.z = obj.z;
    })
    .start();
}