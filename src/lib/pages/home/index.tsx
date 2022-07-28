import { autocomplete, getAlgoliaResults } from "@algolia/autocomplete-js";
import { Box, HStack } from "@chakra-ui/react";
import algoliasearch from "algoliasearch/lite";
import { useEffect } from "react";
// import { Hits, InstantSearch, SearchBox } from "react-instantsearch-hooks-web";
import "@algolia/autocomplete-theme-classic";

type Result = {
  id: string;
  resultType: string;
  image: "string";
  title: "string";
  description: "string";
};

const Home = () => {
  function debouncePromise(fn: () => void, time: number) {
    let timerId: any;

    return function debounced(...args: any[]) {
      if (timerId) {
        clearTimeout(timerId);
      }

      return new Promise((resolve) => {
        timerId = setTimeout(() => resolve(fn(...args)), time);
      });
    };
  }

  const debounced = debouncePromise((items) => Promise.resolve(items), 500);

  const searchClient = algoliasearch(
    "MJJMBZSHW8",
    "eac4f66435f45bf9b2cb45dad424d07b"
  );

  const apiKey = "k_l32j5s0m";

  useEffect(() => {
    autocomplete({
      container: "#autocomplete",
      placeholder: "Search movies...",
      getSources({ query }) {
        return debounced([
          {
            sourceId: "predictions",
            getItems() {
              return fetch(
                `https://imdb-api.com/en/API/SearchMovie/${apiKey}/${query}`
              )
                .then((response) => response.json())
                .then(({ results }: { results: Result[] }) => results);
            },
            onselect: () => console.log("Hello"),
            templates: {
              item({ item }: { item: Result }) {
                return item.title;
                // <img src={item.image} alt="feff" />;
                // (
                //   <Box key={item.id}>
                //     <HStack>
                //       <img src={item.image} />
                //       <Text>{item.title}</Text>
                //     </HStack>
                //   </Box>
                // );
              },
              noResults() {
                return "No results";
              },
            },
            // ...
          },
        ]);
      },
    });
  }, [searchClient, debounced]);

  return (
    <Box
      backgroundImage="/images/movieBackground.jpg"
      backgroundSize="cover"
      boxShadow="inset 0 0 0 100vw rgba(0,0,0,0.6)"
      backgroundRepeat="no-repeat"
      width="full"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box width={{ base: "full", md: "50%" }} mx={10} id="autocomplete" />
      {/* <InstantSearch searchClient={searchClient} indexName="Movies">
        <SearchBox
          style={{
            padding: 20,
            border: "1px solid white",
            backgroundColor: "gray",
          }}
        />
        <Hits />
      </InstantSearch> */}
    </Box>
  );
};

export default Home;
