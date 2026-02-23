// Obiekt do przechowywania indeksów dla każdej karuzeli
const sliderStates = new Map();

function moveSlider(button, direction) {
    const wrapper = button.closest('.slider-wrapper');
    const track = wrapper.querySelector('.slider-track');
    const items = track.querySelectorAll('.slider-item');
    const visibleItems = 3;
    const maxIndex = items.length - visibleItems;

    // Pobierz lub zainicjalizuj stan dla tej konkretnej karuzeli
    if (!sliderStates.has(track)) {
        sliderStates.set(track, 0);
    }

    let currentIndex = sliderStates.get(track);
    currentIndex += direction;

    // Logika "Nieskończoności" (zapętlenie)
    if (currentIndex > maxIndex) {
        currentIndex = 0; // Wróć na początek
    } else if (currentIndex < 0) {
        currentIndex = maxIndex; // Idź na koniec
    }

    sliderStates.set(track, currentIndex);

    // Oblicz przesunięcie (szerokość elementu + gap)
    const itemWidth = items[0].offsetWidth + 15; 
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}