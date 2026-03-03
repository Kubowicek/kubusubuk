  // ==========================================
    // 1. HARMONIJKA
    // ==========================================
    function toggleProject(header) {
        const accordion = header.parentElement;
        const isActive = accordion.classList.contains('active');
        accordion.classList.toggle('active');

        // Zabezpieczenie: gdy otwieramy harmonijkę, upewniamy się, że slider łapie środek
        if (!isActive) {
            const track = accordion.querySelector('.slider-track');
            if (track) {
                setTimeout(() => {
                    const items = track.querySelectorAll('.slider-item');
                    if(items.length >= 3) centerTrack(track, items, 2, false);
                }, 50);
            }
        }
    }
// ==========================================
    // 2. SLIDER (CENTER MODE) - FIX
    // ==========================================
    let isAnimating = false;

    function centerTrack(track, items, targetIndex, animate) {
        const windowWidth = track.parentElement.offsetWidth;
        const activeItem = items[targetIndex];
        if(!activeItem) return;

        const windowCenter = windowWidth / 2;
        const itemCenter = activeItem.offsetLeft + (activeItem.offsetWidth / 2);
        const targetX = windowCenter - itemCenter;

        track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(${targetX}px)`;
    }

    // Funkcja przygotowująca slider (klonuje elementy, by zawsze było co pokazać)
    function setupSliders() {
        document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
            const track = wrapper.querySelector('.slider-track');
            let items = Array.from(track.querySelectorAll('.slider-item'));
            
            // Jeśli mamy mało zdjęć, powielamy je, żeby zapełnić boki
            if (items.length > 0 && items.length < 6) {
                items.forEach(item => {
                    const clone = item.cloneNode(true);
                    track.appendChild(clone);
                });
            }
            
            const newItems = track.querySelectorAll('.slider-item');
            // Startujemy od środkowego elementu (np. przy 8 elementach indeks 3 lub 4)
            centerTrack(track, newItems, Math.floor(newItems.length / 2), false);
        });
    }

    window.addEventListener('load', setupSliders);

    function moveSlider(button, direction) {
        if (isAnimating) return;
        
        const wrapper = button.closest('.slider-wrapper');
        const track = wrapper.querySelector('.slider-track');
        let items = track.querySelectorAll('.slider-item');
        
        if (!track || items.length < 3) return;

        isAnimating = true;

        // Logika przesunięcia:
        // Zamiast przesuwać i czekać na koniec, wykonujemy rotację natychmiast, 
        // ale wizualnie korygujemy to transformacją, by oko nie widziało przeskoku.

        if (direction === 1) {
            // KLIK W PRAWO (Następne zdjęcie)
            centerTrack(track, items, 3, true); // Animujemy do trzeciego elementu

            setTimeout(() => {
                track.appendChild(items[0]); // Przerzuć pierwszy na koniec
                const updatedItems = track.querySelectorAll('.slider-item');
                centerTrack(track, updatedItems, 2, false); // Skocz natychmiast do bazy
                isAnimating = false;
            }, 500); // Czas musi być zgodny z transition w centerTrack

        } else {
            // KLIK W LEWO (Poprzednie zdjęcie)
            centerTrack(track, items, 1, true);

            setTimeout(() => {
                track.prepend(items[items.length - 1]); // Przerzuć ostatni na początek
                const updatedItems = track.querySelectorAll('.slider-item');
                centerTrack(track, updatedItems, 2, false);
                isAnimating = false;
            }, 500);
        }
    }