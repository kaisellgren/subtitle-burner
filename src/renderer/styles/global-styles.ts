import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 10px;
  }
  
  html, body {
    margin: 0;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
  }
  
  body {
    font-size: 1.6rem;
  }
  
  p {
    font-size: 1.6rem;
  }

  ul {
    list-style: none;
  }
`
