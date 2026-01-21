lastImg.addEventListener('pointermove', e => {
  if (!dragging) return;

  currentX = Math.max(-half(), Math.min(0, e.clientX - startX));
  setX(currentX);

  if (Math.abs(currentX) > half() / 2) {
    rightDot?.classList.remove('active');
  } else {
    rightDot?.classList.add('active');
  }
});


    lastImg.style.transition = 'transform 0.3s ease-out';

    if (Math.abs(currentX) > half() / 2) {
      setX(-half());
    } else {
      setX(0);
      rightDot?.classList.add('active');
      carousel.lock(false);
    }
  });
}


