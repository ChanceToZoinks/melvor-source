"use strict";class ProgressBar{constructor(barElem,currentStyle='bg-info'){this.barElem=barElem;this.currentStyle=currentStyle;this.isStriped=false;this.isReversed=false;this.barElem.classList.add('progress-fast');}
animateProgressFromTimer(timer){this.animateProgress((timer.maxTicks-timer.ticksLeft)*TICK_INTERVAL,timer.maxTicks*TICK_INTERVAL);}
animateProgress(elapsedTime,totalTime){if(!game.settings.enableProgressBars)
return;if(this.isStriped)
this.barElem.classList.remove(...ProgressBar.stripeClasses);const delay=-elapsedTime/1000;const duration=totalTime/1000;this.setAnimation('none');this.barElem.style.animation='none';void this.barElem.offsetHeight;this.setAnimation(`${duration}s linear ${delay}s 1 progressBar`);}
animateStriped(){if(!game.settings.enableProgressBars)
return;this.setAnimation('');this.isStriped=true;void this.barElem.offsetHeight;this.barElem.style.width='100%';this.barElem.classList.add(...ProgressBar.stripeClasses);}
stopAnimation(){if(!game.settings.enableProgressBars)
return;void this.barElem.offsetHeight;if(this.isStriped)
this.barElem.classList.remove(...ProgressBar.stripeClasses);this.barElem.style.width='0%';this.setAnimation('none');}
setStyle(newStyle){this.barElem.classList.remove(this.currentStyle);this.barElem.classList.add(newStyle);this.currentStyle=newStyle;}
setAnimation(animation){this.barElem.style.animation=animation;if(this.isReversed)
this.barElem.style.animationDirection='reverse';}
setFixedPosition(percent){if(this.barElem.style.animation!=='')
this.stopAnimation();this.barElem.style.width=`${percent}%`;}}
ProgressBar.stripeClasses=['progress-bar-striped','progress-bar-animated'];