import React, { useEffect } from 'react'

export const TestArray = () => {

    const testeoarray = [ //testeoarray equivale a categories
        {
          "id": 0,
          "name": "feka",
          "items": [
            {
              "id": 0,
              "name": "Café Latte",
              "price": "$1000",
              "description": "café con leche",
              "image": "cafecitooo.jpg"
            },
            {
              "id": 1,
              "name": "Capuchino",
              "price": "$1500",
              "description": "capuchino clásico",
              "image": "capuchino.jpg"
            },
            {
              "id": 2,
              "name": "Capuchino",
              "price": "$1500",
              "description": "capuchino clásico",
              "image": "capuchino.jpg"
            },
            {
              "id": 4,
              "name": "a",
              "price": "2",
              "description": "a",
              "image": "logo-negro-1-240x241.png"
            },
            {
              "id": 7,
              "name": "este es el 7",
              "price": "2",
              "description": "a",
              "image": "logo-negro-1-240x241.png"
            }
          ]
        },
        {
          "id": 1,
          "name": "Milkshakes",
          "items": [
            {
              "id": 0,
              "name": "Milkshake de Vainilla",
              "price": "$1200",
              "description": "milkshake de vainilla",
              "image": "Vanilla Milkshake.jpg"
            },
            {
              "id": 1,
              "name": "Milkshake de Chocolate",
              "price": "$1300",
              "description": "milkshake de chocolate",
              "image": "oreo-milkshake-recipe.jpg"
            },
            {
              "id": 2,
              "name": "Milkshake de sarasa",
              "price": "$1300",
              "description": "milkshake de chocolate",
              "image": "oreo-milkshake-recipe.jpg"
            }
          ]
        },
        {
          "id": 7,
          "name": "Milkshakes",
          "items": [
            {
              "id": 0,
              "name": "Milkshake de Vainilla",
              "price": "$1200",
              "description": "milkshake de vainilla",
              "image": "Vanilla Milkshake.jpg"
            },
            {
              "id": 1,
              "name": "Milkshake de Chocolate",
              "price": "$1300",
              "description": "milkshake de chocolate",
              "image": "oreo-milkshake-recipe.jpg"
            },
            {
              "id": 2,
              "name": "Milkshake de sarasa",
              "price": "$1300",
              "description": "milkshake de chocolate",
              "image": "oreo-milkshake-recipe.jpg"
            }
          ]
        }
      ]

    useEffect(()=>{console.log("testeoarray[0] es: ",testeoarray[0]);}, []);
    useEffect(()=>{console.log("testeoarray[2].id es: ",testeoarray[2].id);}, []);

  return (
    <div>TestArray</div>
  )
}
