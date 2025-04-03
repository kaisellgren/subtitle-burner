import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html {
    font-size: 10px;
  }
  
  html, body {
    margin: 0;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    overflow-x: hidden;
  }
  
  body {
    font-size: 1.8rem;
  }
  
  p {
    font-size: 1.8rem;
  }
  
  h1, h2, h3 {
    color: ${(p) => p.theme.palette.primary.main};
  }

  ul {
    list-style: none;
  }
`
