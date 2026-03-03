// Zmienna blokująca (tzw. debounce), zapobiega zepsuciu animacji przy szybkim, wielokrotnym klikaniu
let isAnimating = false;

function moveSlider(button, direction) {
    if (isAnimating) return; // Jeśli maszyna pracuje, ignorujemy kolejne kliknięcia
    isAnimating = true;

    const wrapper = button.closest('.slider-wrapper');
    const track = wrapper.querySelector('.slider-track');
    const items = track.querySelectorAll('.slider-item');

    // Obliczamy szerokość jednego kafelka (+ 15px na Twój odstęp "gap" z CSS)
    const itemWidth = items[0].offsetWidth + 15; 

    if (direction === 1) {
        // KLIKNIĘCIE W PRAWO
        // 1. Uruchamiamy płynny odjazd w lewo
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateX(-${itemWidth}px)`;

        // 2. Czekamy 500ms (tyle trwa animacja), a potem robimy "magię" pod maską
        setTimeout(() => {
            track.style.transition = 'none'; // Wyłączamy animację na ułamek sekundy
            track.appendChild(items[0]); // Przepinamy pierwsze zdjęcie na sam koniec
            track.style.transform = 'translateX(0)'; // Zerujemy pozycję
            
            isAnimating = false; // Odblokowujemy klikanie
        }, 500);

    } else if (direction === -1) {
        // KLIKNIĘCIE W LEWO
        // 1. Na ułamek sekundy wyłączamy animację i przepinamy OSTATNIE zdjęcie na początek
        track.style.transition = 'none';
        track.prepend(items[items.length - 1]);
        
        // 2. Przesuwamy cały tor w lewo (w ukryciu), żeby zrobić miejsce na wjazd
        track.style.transform = `translateX(-${itemWidth}px)`;

        // 3. Wymuszamy odświeżenie przeglądarki (tzw. reflow), żeby zauważyła zmianę
        void track.offsetWidth;

        // 4. Włączamy płynną animację i wjeżdżamy na ekran
        track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = 'translateX(0)';

        setTimeout(() => {
            isAnimating = false; // Odblokowujemy klikanie po zakończeniu ruchu
        }, 500);
    }
}