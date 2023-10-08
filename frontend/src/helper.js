export function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
  const valid = validFileTypes.find(type => type === file.type);
  //
  if (!valid) {
    return 'redflag';
    // throw Error('provided file is not a png, jpg or jpeg image.');
  }
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise.then(dataUrl => dataUrl);
}

export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'center'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'center'
  },
  variant: 'menu'
}

export const arrayCount = (array) => {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    count = count + array[i];
  }
  return count;
}

export const GetCertainListing = async (listingId, propsToken) => {
  const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${propsToken}`
    }
  });
  return await res.json();
};

export const isDuplicate = (data, obj) => {
  data.some((el) =>
    Object.entries(obj).every(([key, value]) => value === el[key])
  );
}

export function useEmptyValidation (input) {
  return (
    input !== null &&
    input !== undefined &&
    input.length > 0
  );
}

export function useEmailValidation (input) {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(input);
}
