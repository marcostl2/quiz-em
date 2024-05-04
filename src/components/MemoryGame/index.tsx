import React, { useState, useEffect } from 'react';
import './styles.css'; // Certifique-se de que o CSS está atualizado para suportar isso

interface Card {
  id: number;
  word: string;
  flipped: boolean;
  matched: boolean;
}

interface Themes {
  [key: string]: string[];
}

const MemoryGame: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [cards, setCards] = useState<Card[]>([]);
  const [canFlip, setCanFlip] = useState<boolean>(true);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);

  const themes: Themes = {
    Animais: ['Cachorro', 'Gato', 'Elefante', 'Leão', 'Tigre'],
    Frutas: ['Maçã', 'Banana', 'Manga', 'Laranja', 'Abacaxi'],
    Cores: ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Laranja']
  };

  useEffect(() => {
    if (theme) {
      const selectedWords = [...themes[theme], ...themes[theme]].sort(
        () => Math.random() - 0.5
      );
      const newCards = selectedWords.map((word, index) => ({
        id: index,
        word,
        flipped: false,
        matched: false
      }));
      setCards(newCards);
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, flipped: false }))
        );
      }, 3000);
    }
  }, [theme]);

  const handleCardClick = (index: number) => {
    if (!canFlip || cards[index].flipped || cards[index].matched) return;

    const newCards = cards.map((card, i) =>
      i === index ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlippedCards((prev) => [...prev, newCards[index]]);

    if (flippedCards.length === 1) {
      setCanFlip(false);
      setTimeout(() => {
        checkForMatch(newCards[index], flippedCards[0]);
      }, 1000);
    }
  };

  const checkForMatch = (card1: Card, card2: Card) => {
    if (card1.word === card2.word && card1.id !== card2.id) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.word === card1.word ? { ...card, matched: true } : card
        )
      );
    } else {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.matched ? card : { ...card, flipped: false }
        )
      );
    }
    setFlippedCards([]);
    setCanFlip(true);
    checkForEndGame();
  };

  const checkForEndGame = () => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched) {
      alert('Parabéns, você completou o jogo!');
    }
  };

  return (
    <div>
      <h1>Jogo da Memória</h1>
      <select onChange={(e) => setTheme(e.target.value)} value={theme}>
        <option value="">Selecione um tema</option>
        {Object.keys(themes).map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </select>
      <div className="cards-container">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`card ${
              card.flipped || card.matched ? 'visible' : 'flipped'
            }`}
            onClick={() => handleCardClick(index)}
          >
            <div className="card-front">{card.word}</div>
            <div className="card-back">?</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
