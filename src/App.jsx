import { useQuery, gql, useMutation  } from '@apollo/client';
import { Container, Row, Col, FormInput, Button } from "shards-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import React from 'react';


const GET_MESSAGES = gql `
query GetMessages {
    messages {
      id
      content
      user
    }
  }`;

  const POST_MESSAGE = gql `
    mutation ($user: String!, $content: String!) {
      postMessage(user: $user, content: $content)
  }
  `;

const Messages = ({user}) => {
  const { data } = useQuery(GET_MESSAGES, {pollInterval: 500,});
  console.log("eu sou: ", user);
  if (!data) {
    return null
  }
  return data.messages.map(({ id, content, user: messageUser}) => (
    <>
    
    {console.log('eu mandei a msg:', user)}
      <div style={{display: 'flex', justifyContent: user === messageUser ? "flex-end" : "flex-start", paddingBottom: "1rem", paddingRight: "10rem"}}>
        {user !== messageUser && (
          <div style={{ height: 50, width: 50, marginRight: "0.5em", border: "2px solid #e5e6ea", borderRadius:50, textAlign: "center", fontSize: "14pt", paddingTop:10 }}>
            {messageUser.slice(0,2).toUpperCase()}
          </div>
        )}
        <div style={{background: user === messageUser ? "#58bf56" : "#e5e6ea", color:user === messageUser ? "white" : "black", padding:"1rem", borderRadius:"1em", maxWidth:"60%" }}>
          {content}
        </div>
      </div>
    </>
  ));
}

const App = () =>{
  const [state, stateSet] = React.useState({
    user: 'fred',
    content: '',
  });
  const [postMessage] = useMutation(POST_MESSAGE);
  
  const onSend = () =>{
    if (state.content.length > 0){
      postMessage({
        variables: state,
      })
    }
    stateSet({
      ...state,
      content: '',
    })
  }
  console.log('state',state, stateSet);
  return (
    <Container>
      <Messages user={state.user} />
      <Row>
        <Col xs={2} style={{padding: 0}}>
          <FormInput label="User" value={state.user} onChange={(evt) => stateSet ({
            ...state,
            user: evt.target.value,
          })}/>
        </Col>
        <Col xs={8}>
          <FormInput label="Content" value={state.content} onChange={(evt) => stateSet ({
            ...state,
            content: evt.target.value,
          })} 
          onKeyUp={(evt) => {
            if (evt.keyCode === 13) {
              onSend();
            }
          }}
              />
        </Col>
        <Col xs={2} style={{padding: 0}}>
          <Button onClick={() => onSend()}>
            send
          </Button>
        </Col>

      </Row>
    </Container>
  );
}
// eslint-disable-next-line
export default () => {
  return (
    <App/>
  );
}