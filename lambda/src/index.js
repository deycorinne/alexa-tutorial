require('dotenv').config();
const alexa = require('ask-sdk');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
      return alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
      const speakOutput = 'This is a Launch Request!';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
}; 

const HelpIntentHandler = {
  canHandle(handlerInput) {
      return alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      const speakOutput = 'You can say hello to me! How can I help?';

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
      return true;
  },
  handle(handlerInput, error) {
      const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
      console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

// Custom Event handler
// can handle multiple intents
const WifiPasswordIntentHandler = {
  canHandle(handlerInput) {
      return alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && alexa.getIntentName(handlerInput.requestEnvelope) === 'WifiPasswordIntent';
  },
  handle(handlerInput) {
      const speakOutput = 'Where are you?';
      handlerInput.attributesManager.setSessionAttributes({"previous_intent" : "WifiPasswordIntent"});

      if (sessionAttributes.location != null) {
        speakOutput = 'The wifi password for the ' + location + ' house is "' + process.env[slot.toUpperCase()] + '".';
      } 
      
      return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

// Custom Event handler
// can handle multiple intents
const WhereIntentHandler = {
  canHandle(handlerInput) {
      return alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && alexa.getIntentName(handlerInput.requestEnvelope) === 'WhereIntentHandler';
  },
  handle(handlerInput) {
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      let location = handlerInput.requestEnvelope.request.intent.slots.location.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        
      let speakOutput = 'You said you are at ' + location + '. What is it you want?';

      if (sessionAttributes.previous_intent == 'WifiPasswordIntent') {
        speakOutput = 'The wifi password for the ' + location + ' house is "' + process.env[slot.toUpperCase()] + '".';
      } 
      
      handlerInput.attributesManager.setSessionAttributes({"previous_intent" : "WhereIntentHandler"});

      return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
  }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
 exports.handler = async function(event, context) {
    if (process.env.DEBUG === "true") {
      console.log(`REQUEST++++${JSON.stringify(event)}`);
    }
  
    let skill = alexa.SkillBuilders.standard()
        .withSkillId(process.env.ASK_SKILL_ID)
        .addRequestHandlers( 
            LaunchRequestHandler, 
            WhereIntentHandler,
            WifiPasswordIntentHandler,
            HelpIntentHandler
        )
        .addErrorHandlers(ErrorHandler)
        .create();
    
    const response = await skill.invoke(event, context);

    if (process.env.DEBUG === "true") {
      console.log(`RESPONSE++++${JSON.stringify(response)}`);
    }
    return response;
  };
  