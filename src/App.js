import React, { Component } from "react";
import quizQuestions from "./API/quizQuestions";
import Quiz from "./Components/Quiz/Quiz";
import Result from "./Components/Result";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      questionId: 1,
      question: "",
      story: "",
      answerOptions: [],
      answer: "",
      answersCount: {},
      result: "",
      img: "",
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentDidMount() {
    const shuffledAnswerOptions = quizQuestions.map((question) =>
      this.shuffleArray(question.answers)
    );
    this.setState({
      img: quizQuestions[0].img,
      story: quizQuestions[0].story,
      question: quizQuestions[0].question,
      answerOptions: shuffledAnswerOptions[0],
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);

    if (this.state.questionId < quizQuestions.length) {
      setTimeout(() => this.setNextQuestion(), 300);
    } else {
      setTimeout(() => this.setResults(this.getResults()), 300);
    }
  }

  setUserAnswer(answer) {
    this.setState((state, props) => ({
      answersCount: {
        ...state.answersCount,
        [answer]: (state.answersCount[answer] || 0) + 1,
      },
      answer: answer,
    }));
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: quizQuestions[counter].question,
      story: quizQuestions[counter].story,
      img: quizQuestions[counter].img,
      answerOptions: quizQuestions[counter].answers,
      answer: "",
    });
  }

  getResults() {
    const answersCount = this.state.answersCount;
    const answersCountKeys = Object.keys(answersCount);
    const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
    const maxAnswerCount = Math.max.apply(null, answersCountValues);

    return answersCountKeys.filter(
      (key) => answersCount[key] === maxAnswerCount
    );
  }

  setResults(result) {
    if (result.length === 1) {
      this.setState({ result: result[0] });
    } else {
      this.setState({ result: "Mixed" });
    }
  }

  renderQuiz() {
    return (
      <Quiz
        img={this.state.img}
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        story={this.state.story}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return <Result quizResult={this.state.result} />;
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Find what playlist fits your feeling</h2>
        </div>
        <img src={this.state.img} alt="pic"></img>
        <div className="quiz-render">
          {this.state.result ? this.renderResult() : this.renderQuiz()}
        </div>
      </div>
    );
  }
}

export default App;
