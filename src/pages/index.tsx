import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {
  const fetchProjects = async ({ pageParam = 0 }) => {
    const { data: images } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return images;
  };

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: 'images',
    queryFn: fetchProjects,
    getNextPageParam: lastPage => lastPage?.pages?.after ?? null,
  });

  const formattedData = useMemo(() => {
    return data?.pages.map(page => page.data).flat();
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {formattedData.length > 0 && <CardList cards={formattedData} />}
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
            loadingText="Carregando..."
          >
            Carregar mais
          </Button>
        )}
      </Box>
    </>
  );
}
