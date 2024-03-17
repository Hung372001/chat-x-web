import DownloadIcon from './icons/download-icon';
import { Button } from './ui/button';

function DownloadButton({ url }: { url: string }) {
  const fetchImage = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  };

  const downloadImage = async (url: string) => {
    const imageBlob = await fetchImage(url);
    const imageBase64 = URL.createObjectURL(imageBlob);

    const a = document.createElement('a');
    a.style.setProperty('display', 'none');
    document.body.appendChild(a);
    a.download = url.replace(/^.*[\\\/]/, '');
    a.href = imageBase64;
    a.click();
    a.remove();
  };

  return (
    <Button className='h-8 w-8 rounded-md bg-gray-600 p-0' onClick={() => downloadImage(url)}>
      <DownloadIcon />
    </Button>
  );
}

export default DownloadButton;
