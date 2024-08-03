document.addEventListener('DOMContentLoaded', function () {
	const bodyElement = document.querySelector('body');
	const jsonPath = bodyElement.getAttribute('data-json-path');

	fetch('../' + jsonPath + '/reviews.json')
		.then(response => response.json())
		.then(data => {
			if (!data || !data.reviews || !data.overallRating) {
				console.error('Нет данных для отображения');
				return;
			}

			const reviews = Array.isArray(data.reviews) ? data.reviews : [data.reviews];

			// Сортировка отзывов по дате написания (по убыванию)
			reviews.sort((a, b) => {
				const dateA = new Date(a.updatedTime).getTime();
				const dateB = new Date(b.updatedTime).getTime();
				return dateB - dateA;
			});

			const carousel = document.querySelector('.swiper-wrapper');

			if (reviews.length === 0) {
				console.error('Нет отзывов для отображения');
				return;
			}

			let totalReviews = reviews.length;
			let maxRatingReviews = reviews.filter(review => review.rating === 5);

			// Обновляем заголовок
			const ratingValue = data.overallRating; // Динамическое значение рейтинга из JSON
			document.getElementById('rating-value').innerText = ratingValue;
			document.getElementById('review-count').innerText = totalReviews;
			document.getElementById('review-declension').innerText = reviewDeclension(totalReviews);

			updateRatingStars(ratingValue);

			maxRatingReviews.forEach(review => {
				const reviewElement = document.createElement('div');
				reviewElement.classList.add('swiper-slide');

				const avatarUrl = review.author?.avatarUrl ? review.author.avatarUrl.replace('{size}', 'islands-68') : '';
				const firstLetter = review.author?.name.charAt(0) || '';
				const colorClass = getColorClass(firstLetter);
				const userIcon = avatarUrl
					? `<div class="user-icon-view__icon" style="background-image:url('${avatarUrl}')"></div>`
					: `<div class="user-icon-view__icon ${colorClass}">${firstLetter}</div>`;

				const userProfileLink = review.author?.publicId
					? `<a href="https://yandex.ru/maps/user/${review.author.publicId}" target="_blank" rel="nofollow">
						${review.author?.name || 'Без имени'}
					</a>`
					: `${review.author?.name || 'Без имени'}`;

				reviewElement.innerHTML = `
                    <div class="review">
                        <div class="review-header">
                            ${userIcon}
                            <div class="review-info">
                                <div class="review-author">
                                    ${userProfileLink}
                                </div >
                                <div class="review-level">${review.author?.professionLevel || 'Без уровня'}</div>
                                <div class="review-rating stars">${getStars(review.rating)}</div>
                                <div class="review-date">${new Date(review.updatedTime).toLocaleDateString()}</div>
                            </div >
                        </div >
				<div class="review-content">
					<p class="review-text">${review.text}</p>
					<span class="read-more" onclick="toggleReview(this)">Читать полностью</span>
				</div>
                    </div >
				`;

				carousel.appendChild(reviewElement);
			});

			// Проверяем длину текста и скрываем кнопку, если текст короткий
			document.querySelectorAll('.review-content').forEach(reviewContentElement => {
				const reviewTextElement = reviewContentElement.querySelector('.review-text');
				const readMoreButton = reviewContentElement.querySelector('.read-more');

				if (isShortText(reviewTextElement)) {
					readMoreButton.style.display = 'none'; // Скрываем кнопку, если текст короткий
				}
			});

			const swiper = new Swiper('.swiper-container', {
				navigation: {
					nextEl: '.next',
					prevEl: '.prev',
				},
				loop: true,
				autoHeight: true,
				spaceBetween: 10,
				slidesPerView: 1,
				breakpoints: {
					480: {
						slidesPerView: 1,
					},
					640: {
						slidesPerView: 2,
					},
					920: {
						slidesPerView: 3,
					}
				}
			});

			setTimeout(() => {
				swiper.update();
			}, 100);
		})
		.catch(error => {
			console.error('Ошибка загрузки отзывов:', error);
		});
});

function toggleReview(element) {
	const reviewText = element.previousElementSibling;

	if (reviewText.classList.contains('expanded')) {
		reviewText.classList.remove('expanded');
		element.innerText = 'Читать полностью';
	} else {
		reviewText.classList.add('expanded');
		element.innerText = 'Скрыть';
	}
}

function getStars(rating) {
	const fullStar = '<div class="star filled"></div>';
	const emptyStar = '<div class="star empty"></div>';
	const halfStar = '<div class="star half"></div>';
	let stars = '';
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 !== 0;

	for (let i = 0; i < fullStars; i++) {
		stars += fullStar;
	}

	if (hasHalfStar) {
		stars += halfStar;
	}

	for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
		stars += emptyStar;
	}

	return stars;
}

function updateRatingStars(rating) {
	const starsContainer = document.createElement('div');
	starsContainer.classList.add('rating-stars');
	starsContainer.innerHTML = getStars(rating);
	const ratingElement = document.querySelector('#rating-stars');
	if (ratingElement) {
		ratingElement.innerHTML = '';
		ratingElement.appendChild(starsContainer);
	}
}

function getColorClass(letter) {
	const colors = ['_color_1', '_color_2', '_color_3', '_color_4', '_color_5', '_color_6', '_color_7', '_color_8', '_color_9'];
	const index = letter.toUpperCase().charCodeAt(0) % colors.length;
	return colors[index];
}

function reviewDeclension(number) {
	if (number % 10 === 1 && number % 100 !== 11) {
		return 'отзыва';
	}
	return 'отзывов';
}


function calculateLineHeight(element) {
	// Создание временного элемента для расчета высоты строки
	const tempElement = document.createElement('div');
	const style = getComputedStyle(element);

	// Настройка временного элемента с таким же стилем
	tempElement.style.visibility = 'hidden';
	tempElement.style.position = 'absolute';
	tempElement.style.fontSize = style.fontSize;
	tempElement.style.fontFamily = style.fontFamily;
	tempElement.style.lineHeight = style.lineHeight; // Используем 'normal' или конкретное значение

	// Добавление временного элемента в документ
	document.body.appendChild(tempElement);

	// Добавление текста для расчета высоты строки
	tempElement.innerText = 'M'; // Высокий символ для точных измерений

	// Получение высоты строки
	const lineHeight = parseFloat(getComputedStyle(tempElement).height);

	// Удаление временного элемента
	document.body.removeChild(tempElement);

	return lineHeight;
}


function getTextHeight(text, element) {
	// Создаем временный canvas для измерения высоты текста
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	const style = getComputedStyle(element);
	context.font = `${style.fontSize} ${style.fontFamily}`;

	const lineHeight = calculateLineHeight(element);
	const words = text.split(' ');
	let height = 0;
	let line = '';

	for (const word of words) {
		const testLine = line + word + ' ';
		const metrics = context.measureText(testLine);
		const testWidth = metrics.width;

		if (testWidth > canvas.width) {
			line = word + ' ';
			height += lineHeight;
		} else {
			line = testLine;
		}
	}

	height += lineHeight; // Добавляем высоту последней строки
	return height;
}

function isShortText(element) {
	const maxLines = 3;
	const lineHeight = calculateLineHeight(element);
	const maxHeight = lineHeight * maxLines;

	// Получаем полный текст элемента
	const textContent = element.innerText;

	// Рассчитываем высоту текста
	const textHeight = getTextHeight(textContent, element);

	return textHeight <= maxHeight;
}
