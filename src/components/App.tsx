import greenlet from "greenlet";
import { useEffect, useState } from "react";







type Photo = {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
};

async function getPhotos(): Promise<Photo[]> {
  const response = await fetch('https://jsonplaceholder.typicode.com/photos');
  const json = await response.json();

  return json as Photo[];
}

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
      let chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
}


function filterFunc(obj: Photo): boolean {
  for (let i = 0; i < 5000; i++) {
    const hash = hashCode(obj.title);
  }

  const hash = hashCode(obj.title);


  let extraSum = 0;

  for (let i = 0; i < obj.title.length; i++) {
    if (obj.title[i] === 'a') {
      extraSum++;
    }
  }

  const moreThan2 = extraSum > 2;

  return moreThan2 && hash % 2 === 0;
}


type FilterFunc<T extends object> = (obj: T) => boolean;


async function filterObjects<T extends object>(objects: T[], filterFunc: FilterFunc<T>): Promise<T[]> {
  return objects.filter(obj => filterFunc(obj));
}











const greenletTest = async (objects: Photo[]): Promise<Photo[]> => {
  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  
  
  function filterFunc(obj: Photo): boolean {
    for (let i = 0; i < 5000; i++) {
      const hash = hashCode(obj.title);
    }
  
    const hash = hashCode(obj.title);
  
  
    let extraSum = 0;
  
    for (let i = 0; i < obj.title.length; i++) {
      if (obj.title[i] === 'a') {
        extraSum++;
      }
    }
  
    const moreThan2 = extraSum > 2;
  
    return moreThan2 && hash % 2 === 0;
  }



  return objects.filter(obj => filterFunc(obj));
};


const filterObjectsAsync1 = greenlet(greenletTest);
const filterObjectsAsync2 = greenlet(greenletTest);
const filterObjectsAsync3 = greenlet(greenletTest);
const filterObjectsAsync4 = greenlet(greenletTest);
const filterObjectsAsync5 = greenlet(greenletTest);















function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    (async function () {
      const photos = await getPhotos();

      setPhotos(photos);
    })();
  }, []);

  async function handleSlowFilterClick() {

    const res = await filterObjects(photos, filterFunc);

    console.log('filtered', res.length);
  }

  async function handleFilterClick() {

    const newPhotos1Wait = filterObjectsAsync1(photos.slice(0, 1000));
    const newPhotos2Wait = filterObjectsAsync2(photos.slice(1000, 2000));
    const newPhotos3Wait = filterObjectsAsync3(photos.slice(2000, 3000));
    const newPhotos4Wait = filterObjectsAsync4(photos.slice(3000, 4000));
    const newPhotos5Wait = filterObjectsAsync5(photos.slice(4000, 5000));

    const newPhotos1 = await newPhotos1Wait;
    const newPhotos2 = await newPhotos2Wait;
    const newPhotos3 = await newPhotos3Wait;
    const newPhotos4 = await newPhotos4Wait;
    const newPhotos5 = await newPhotos5Wait;


    const res = newPhotos1
      .concat(newPhotos2)
      .concat(newPhotos3)
      .concat(newPhotos4)
      .concat(newPhotos5);


    
    console.log('filtered', res.length);
  }

  function handleTestClick() {
    console.log('test');
  }

  return (
    <div style={{ padding: 200 }}>
      Photos: {photos.length}
      <br />
      <button onClick={handleTestClick}>Test</button>
      <button onClick={handleFilterClick}>Filter</button>
      <button onClick={handleSlowFilterClick}>Slow Filter</button>
    </div>
  )
}

export default App
