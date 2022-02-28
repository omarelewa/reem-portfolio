import GlobalStyles from "./globalStyles";
import {ThemeProvider} from "styled-components";
import {lightTheme} from "./components/Themes";
import {Route, Switch} from "react-router-dom";

// Components
import Main from "./components/Main"
import AboutPage from "./components/AboutPage"
import BlogPage from "./components/BlogPage"
import MySkillsPage from "./components/MySkillsPage"
import WorkPage from "./components/WorkPage"

function App() {
  return <>
    <GlobalStyles/>
    <ThemeProvider theme={lightTheme}>
      <Switch>
        <Route exact path="/" component={Main}/>
        <Route exact path="/about" component={AboutPage}/>
        <Route exact path="/blog" component={BlogPage}/>
        <Route exact path="/work" component={WorkPage}/>
        <Route exact path="/skills" component={MySkillsPage}/>
      </Switch>
    </ThemeProvider>
    </>
    
}

export default App

