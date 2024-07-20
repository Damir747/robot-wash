// document.getElementById('floating-button').addEventListener('click', function () {
// 	window.scrollTo({
// 		top: 0,
// 		behavior: 'smooth'
// 	});
// });

const findElement = (container, selector) => {
	if (container === null) {
		return null;
	}
	return container.querySelector(selector);
};
const findElementAll = (container, selector) => {
	if (container === null) {
		return [];
	}
	return container.querySelectorAll(selector);
};
(function burgerMenu() {
	// Меню бургер
	const iconMenu = findElement(document, '.menu__icon');
	const menuBody = findElement(document, '.menu__body');
	if (iconMenu && menuBody) {
		iconMenu.addEventListener("click", function (evt) {
			document.body.classList.toggle('_lock');
			iconMenu.classList.toggle('_active');
			menuBody.classList.toggle('_active');
		});
	}

	// const first = findElementAll(document, '.menu__link')[1];
	// const department = findElement(document, first.dataset.goto);

	function showBoundingClientRect() {
		// console.log(department.getBoundingClientRect().top + pageYOffset);
	}
	document.addEventListener('scroll', showBoundingClientRect);

	// Прокрутка при клике
	const menuLinks = findElementAll(document, '.menu__link[data-goto]');
	if (menuLinks.length > 0) {
		menuLinks.forEach(menuLink => {
			menuLink.addEventListener('click', onMenuLinkClick)
		});
		function onMenuLinkClick(evt) {
			const menuLink = evt.target;
			// console.log(evt.target);
			const gotoBlock = findElement(document, menuLink.dataset.goto);
			if (menuLink.dataset.goto && gotoBlock) {
				const gotoBlockValue = gotoBlock.getBoundingClientRect().top + pageYOffset - findElement(document, '.header_main').offsetHeight;
				// console.log('>', gotoBlock.getBoundingClientRect().top);	// изменяется. Прокрутка до середины раздела делает нужным высоту раздела
				// console.log(pageYOffset);
				// console.log(findElement(document, '.header_main').offsetHeight);
				if (iconMenu.classList.contains('_active')) {
					document.body.classList.toggle('_lock');
					if (iconMenu && menuBody) {
						iconMenu.classList.toggle('_active');
						menuBody.classList.toggle('_active');
					}
				}
				window.scrollTo({
					top: gotoBlockValue,
					behavior: "smooth"
				});
				evt.preventDefault();
			}
		}
	}
})();