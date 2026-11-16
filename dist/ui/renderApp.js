import { CountrySearchController } from '../store/searchController.js';
import { createElement } from './createElement.js';
export function initApp() {
    const app = createElement('main', 'app');
    const header = createElement('header', 'header');
    const headerContainer = createElement('div', 'container');
    const title = createElement('h1', 'header__title', 'Поиск стран мира');
    const subtitle = createElement('p', 'header__subtitle', 'Введите название страны на английском языке (например, Spain, Japan, Brazil)');
    headerContainer.append(title, subtitle);
    header.append(headerContainer);
    const section = createElement('section', 'field');
    const container = createElement('div', 'container');
    const fieldWrap = createElement('div', 'field__wrap');
    const input = createElement('input', 'field__input');
    input.type = 'search';
    input.placeholder = 'Начните вводить название страны...';
    input.setAttribute('aria-label', 'Поиск страны');
    fieldWrap.append(input);
    container.append(fieldWrap);
    section.append(container);
    const statusContainer = createElement('div', 'field__status');
    const results = createElement('section', 'field__result');
    const modal = createElement('dialog', 'field__modal modal');
    app.append(header, section, statusContainer, results, modal);
    document.body.append(app);
    const openDetails = (country) => {
        modal.replaceChildren();
        const card = createElement('div', 'modal__card');
        const banner = createElement('div', 'modal__banner');
        const closeBtn = createElement('button', 'modal__btn modal__btn--close', '✕');
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Закрыть окно');
        closeBtn.addEventListener('click', () => {
            modal.close();
        });
        const headerRow = createElement('div', 'modal__header');
        if (country.flag) {
            const img = createElement('img', 'modal__flag');
            img.src = country.flag;
            img.alt = `Флаг ${country.name}`;
            headerRow.append(img);
        }
        const titleGroup = createElement('div', 'modal__title-group');
        const nameEl = createElement('h2', 'modal__title', country.name);
        const desc = createElement('p', 'modal__desc', country.description);
        titleGroup.append(nameEl, desc);
        headerRow.append(titleGroup);
        banner.append(closeBtn, headerRow);
        const body = createElement('div', 'modal__body');
        const metrics = createElement('div', 'modal__metrics');
        const metricItems = [
            ['Столица', country.capital],
            ['Население', country.population.toLocaleString('ru-RU')],
            ['Площадь', `${country.area.toLocaleString('ru-RU')} км²`],
        ];
        for (const [label, value] of metricItems) {
            const box = createElement('div', 'modal__metric');
            const labelEl = createElement('span', 'modal__metric-label', label);
            const valueEl = createElement('span', 'modal__metric-value', value);
            box.append(labelEl, valueEl);
            metrics.append(box);
        }
        const createTagSection = (titleText, items, fallbackText, modifier) => {
            const sectionEl = createElement('div', 'modal__section');
            const sectionTitle = createElement('h3', 'modal__section-title', titleText);
            const tagsWrap = createElement('div', 'modal__tags');
            if (items.length === 0) {
                const emptyTag = createElement('span', 'modal__tag modal__tag--empty', fallbackText);
                tagsWrap.append(emptyTag);
            }
            else {
                for (const item of items) {
                    const tag = createElement('span', `modal__tag ${modifier}`, item);
                    tagsWrap.append(tag);
                }
            }
            sectionEl.append(sectionTitle, tagsWrap);
            return sectionEl;
        };
        const langsSection = createTagSection('Языки', country.languages, 'Нет данных', 'modal__tag--lang');
        const currenciesSection = createTagSection('Валюта', country.currencies, 'Нет данных', 'modal__tag--currency');
        const bordersSection = createTagSection('Граничит со странами', country.borders, 'Островное государство / нет границ', 'modal__tag--border');
        body.append(metrics, langsSection, currenciesSection, bordersSection);
        card.append(banner, body);
        modal.append(card);
        modal.showModal();
    };
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.close();
        }
    });
    const renderState = (state) => {
        statusContainer.replaceChildren();
        results.replaceChildren();
        if (state.status === 'loading') {
            const loader = createElement('div', 'status__box--loading');
            const spinner = createElement('span', 'spinner');
            spinner.setAttribute('aria-hidden', 'true');
            const text = createElement('span', '', 'Загрузка стран...');
            loader.append(spinner, text);
            statusContainer.append(loader);
            return;
        }
        if (state.status === 'empty') {
            const emptyBox = createElement('div', 'status__box--empty', 'Ничего не найдено. Попробуйте изменить запрос.');
            statusContainer.append(emptyBox);
            return;
        }
        if (state.status === 'error') {
            const errorBox = createElement('div', 'status__box--error');
            const msg = createElement('p', 'error-text', state.errorMessage ?? 'Произошла ошибка');
            const retryBtn = createElement('button', 'status__btn status__btn--retry', 'Повторить');
            retryBtn.type = 'button';
            retryBtn.addEventListener('click', () => {
                void controller.retry();
            });
            errorBox.append(msg, retryBtn);
            statusContainer.append(errorBox);
            return;
        }
        if (state.status === 'success') {
            for (const country of state.countries) {
                const card = createElement('article', 'country__card');
                card.tabIndex = 0;
                const media = createElement('div', 'card__media');
                if (country.flag) {
                    const img = createElement('img', 'card__flag');
                    img.src = country.flag;
                    img.alt = `Флаг ${country.name}`;
                    media.append(img);
                }
                const regionBadge = createElement('span', 'card__badge', country.region);
                media.append(regionBadge);
                const body = createElement('div', 'card__body');
                const name = createElement('h2', 'card__title', country.name);
                const stats = createElement('div', 'card__stats');
                const capitalStat = createElement('div', 'card__stat');
                const capitalLabel = createElement('span', 'card__stat-label', 'Столица');
                const capitalValue = createElement('span', 'card__stat-value', country.capital);
                capitalStat.append(capitalLabel, capitalValue);
                const popStat = createElement('div', 'card__stat');
                const popLabel = createElement('span', 'card__stat-label', 'Население');
                const popValue = createElement('span', 'card__stat-value', country.population.toLocaleString('ru-RU'));
                popStat.append(popLabel, popValue);
                stats.append(capitalStat, popStat);
                const footer = createElement('div', 'card__footer');
                const langText = country.languages.length > 0
                    ? country.languages.slice(0, 2).join(', ')
                    : 'Язык не указан';
                const langs = createElement('span', 'card__langs', langText);
                const action = createElement('span', 'card__more', 'Подробнее →');
                footer.append(langs, action);
                body.append(name, stats, footer);
                card.append(media, body);
                card.addEventListener('click', () => openDetails(country));
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openDetails(country);
                    }
                });
                results.append(card);
            }
        }
    };
    const controller = new CountrySearchController(renderState, 300);
    input.addEventListener('input', () => {
        controller.handleInput(input.value);
    });
}
