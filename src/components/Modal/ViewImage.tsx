import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Image src={imgUrl} alt="Wallpaper" maxW="900px" maxH="600px" />
        </ModalBody>
        <ModalFooter>
          <Link target="_blank" href={imgUrl}>
            Ver original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
