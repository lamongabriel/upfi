import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [selectedImageURL, setSelectedImageURL] = useState('');

  const handleViewImage = useCallback(
    (url: string) => {
      setSelectedImageURL(url);

      onOpen();
    },
    [onOpen]
  );

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage
        imgUrl={selectedImageURL}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}
