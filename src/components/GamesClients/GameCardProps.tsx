import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 20px;
`;

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 8px;
  font-size: 16px;
`;

const SelectCategory = styled.select`
  padding: 8px;
  font-size: 16px;
`;

const SelectProvider = styled.select`
  padding: 8px;
  font-size: 16px;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: auto;
  grid-gap: 10px;
`;

const Card = styled.div`
  background: #ffffff;
  box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ImageWrapper = styled.div`
  margin-bottom: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
`;

const GameCardProps: React.FC<GameCardProps> = ({ usuario }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedProvider, setSelectedProvider] = useState("Todos");

  const uniqueCategories = [...new Set(usuario.games.map(juego => juego.category))];
  const uniqueProviders = [...new Set(usuario.games.map(juego => juego.provider_name))];

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvider(event.target.value);
  };

  const juegosFiltrados = usuario.games.filter(juego => {
    return (
      (selectedCategory === "Todas" || juego.category === selectedCategory) &&
      (selectedProvider === "Todos" || juego.provider_name === selectedProvider) &&
      (juego.name && juego.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <Container>
      <FiltersContainer>
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Buscar Juego..."
        />
        <div>
          <label htmlFor="category">Categoría:</label>
          <SelectCategory
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Todas">Todas</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </SelectCategory>
        </div>
        <div>
          <label htmlFor="provider">Proveedor:</label>
          <SelectProvider
            id="provider"
            value={selectedProvider}
            onChange={handleProviderChange}
          >
            <option value="Todos">Todos</option>
            {uniqueProviders.map(provider => (
              <option key={provider} value={provider}>{provider}</option>
            ))}
          </SelectProvider>
        </div>
      </FiltersContainer>
      <CardContainer>
        {juegosFiltrados.map((juego, index) => (
          <Card key={juego.id} style={{ gridRow: Math.floor(index / 6) + 1 }}>
            <ImageWrapper>
              <Image src={juego.image} alt={juego.provider_name} />
            </ImageWrapper>
            <div>
              <p>Proveedor: {juego.provider_name}</p>
              <p>ID del Proveedor: {juego.provider}</p>
              <p>Categoría: {juego.category}</p>
              <p>{juego.name}</p>
            </div>
          </Card>
        ))}
      </CardContainer>
    </Container>
  );
};

export default GameCardProps;

