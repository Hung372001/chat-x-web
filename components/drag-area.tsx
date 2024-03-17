import { useDataContext } from '@/context/data-context';
import { useDragging } from '@/hooks/useDragging';
import { useTranslations } from 'next-intl';
import React from 'react';
import { useDropzone } from 'react-dropzone';

export default function DragArea() {
  const { isDragging } = useDragging();
  const { setSelectedFiles } = useDataContext();
  const t = useTranslations();

  const onDrop = (acceptedFiles: any) => {
    const selectedFiles: File[] = Array.from(acceptedFiles);
    setSelectedFiles((prev) => [...selectedFiles, ...(prev || [])]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
      'video/*': [],
    },
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className={`${
          isDragging ? 'flex' : 'hidden'
        }  absolute left-0 top-0 h-full w-full items-center justify-center bg-gray-200/50 text-xl font-medium backdrop-blur-sm`}
      >
        {t('DROP_FILES_HERE')}
      </div>

      <input {...getInputProps()} />
    </>
  );
}
