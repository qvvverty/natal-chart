import { fillCoordinates } from "./FormHandler";

export default function mapInit() {
  const map = new ymaps.Map("map-container", {
    center: [50.588144, 75.733842],
    zoom: 2
  }, {
    balloonMaxWidth: 200,
    searchControlProvider: 'yandex#search'
  });

  map.events.add('click', function (e) {
    if (!map.balloon.isOpen()) {
      const coords = e.get('coords').map(coord => coord.toPrecision(6));
      fillCoordinates(coords[1], coords[0]);
      map.balloon.open(coords, {
        contentHeader: 'Координаты получены',
        contentBody: [
          coords[0],
          coords[1]
        ].join(', ')
      });
    }
    else {
      map.balloon.close();
    }
  });

  // Hide balloon
  map.events.add('balloonopen', function (e) {
    map.hint.close();
  });
}
