'use stict';
const pokemons = require('../pokemon');
const Pokemon = pokemons.Pokemon;
const Pokemonlist = pokemons.Pokemonlist;
const expect = require('chai').expect;
const assert = require('chai').assert;

describe('PokemonTesting', () => {
  it('Pokemon.show() testing: returns Pokemon object with propertys name/level', () => {
    const pokemon = new Pokemon('test1', 'test2');
    expect(pokemon).to.have.property('name');
    expect(pokemon).to.have.property('level');
    assert.equal(pokemon.name, 'test1');
    assert.equal(pokemon.level, 'test2');
  });
});

describe('PokemonListTesting', () => {
  let pokemonList, pokemon;

  beforeEach(() => {
    pokemonList = new Pokemonlist();
    pokemon = new Pokemon('test1', 'test2');
    assert.typeOf(pokemonList, 'Array');
  });

  it('PokemonList.add() testing: added Pokemon in the end of array', () => {
    pokemonList.add('test1', 'test2');
    const lastEl = pokemonList[pokemonList.length - 1];
    assert.deepEqual(lastEl, pokemon);
    expect(lastEl.name).to.equal('test1');
    expect(lastEl.level).to.equal('test2');
  });

  it('PokemonList.show() testing: every element is a Pokemon and have property Show', () => {
    pokemonList.add('test1', 'test2');
    pokemonList.forEach(item => {
      assert.deepEqual(item, pokemon);
      expect(item).to.have.property('show');
    });
    
  });

  it('PokemonList.max() testing: ', () => {
    pokemonList.add('test1', 'test2');
    pokemonList.add('test3', 'test4');
    console.log(pokemonList, Math.max(pokemonList));

    const strongestPokemon = Math.max(pokemonList);
    expect(strongestPokemon).to.be.equal(pokemonList[pokemonList.length])

  });
 
});



// Напишите тесты на метод max класса PokemonList;
// в this лежат числа, убедиться, что возвращает наибольшее  в strongestPokemon, 
// если массив из одного числа вернет его, если массив пустой - ошибка

// При написании тестов грамотно организовывайте тесты 
// по файлам и наборам. И максимально используйте хуки, и другие возможности Mocha, чтобы тесты соответствовали принципу DRY.