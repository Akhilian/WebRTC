import React, { Component } from 'react';
import MasterCamera from './MasterCamera';
import { v4 as uuidv4 } from 'uuid';
import Eve from './Eve';

function didSomeoneTriedToConnectWithAnOffer(currentUser, events) {
  const offers = events.filter((event) => event.from !== currentUser && event.offer)
  return offers.length > 0
}

function didSomeoneSentAnAnswerToMe(currentUser, events) {
  const answers = events.filter((event) => event.from !== currentUser && event.answer)
  return answers.length > 0
}

function getAnswerEvent(currentUser, events) {
  const answers = events.filter((event) => event.from !== currentUser && event.answer)
  return answers[0]
}

function getOfferEvent(currentUser, events) {
  const offers = events.filter((event) => event.from !== currentUser  && event.offer)

  return offers[0]
}

const EventMessage = ({event}) => (
  <article className="message is-dark" >
    <div className="message-header">
      {event.offer ? ('Offer') : ('Answer')}
    </div>
    <div className="message-body">
      <p>Date: {JSON.stringify(event.dateEmitted)}</p>
      <p>From: {JSON.stringify(event.from)}</p>
      <p>To: {JSON.stringify(event.to)}</p>
    </div>
  </article>
)

class EventsStream extends Component {
  render() {
    const messages = [];
    const events = this.props.events
    for(let index in events) {
      messages.push((
        <EventMessage key={index} event={this.props.events[index]} />
      ))
    }

    return <>{messages}</>
  }
}

class Tabletop extends Component {

  constructor(props, query) {
    const { match } = props
    const { params } = match

    super(props)
    this.state = {
      userId: params.name,
      events: []
    }
  }

  componentDidMount() {
    console.log('Initialize the stream')
    const events = new EventSource(`http://localhost:5000/stream?uuid=${this.state.userId}`);
    events.onmessage = (event) => {
      const listOfEvents = this.state.events;
      listOfEvents.push(JSON.parse(event.data))
      this.setState({ events: listOfEvents })
    };
  }

  render() {
    let events = this.state.events

    const isSomeoneTriedToConnect = didSomeoneTriedToConnectWithAnOffer(
      this.state.userId, this.state.events
    )

    const hasSomeoneAnswerd = didSomeoneSentAnAnswerToMe(
      this.state.userId, this.state.events
    )

    let answer;
    if(hasSomeoneAnswerd) {
      answer = getAnswerEvent(this.state.userId, this.state.events)
    }

    return (
      <section className="hero is-fullheight">
        <section className="section tabletop">
          <div className="columns">
            <div className="side">
              <MasterCamera userId={this.state.userId} answerEvent={answer}/>
              <EventsStream events={events} userId={this.state.userId}/>
            </div>

            <div className="side">
              {!isSomeoneTriedToConnect && (
                <p>Waiting for someone to connect</p>
              )}
              {isSomeoneTriedToConnect && (
                <Eve offerEvent={getOfferEvent(this.state.userId, this.state.events)} uuid={this.state.userId} />
              )}
            </div>
          </div>        
        </section>
      </section>
    );
  }
}

export default Tabletop;

