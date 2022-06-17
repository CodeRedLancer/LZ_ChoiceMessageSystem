//=============================================================================
// LZ Plugin - Choice Message System
// LZ_ChoiceMessageSystem.js
// by Lanzy
// Date: 06/10/2022
//=============================================================================

var Imported = Imported || {};
Imported.LZ_ChoiceMessageSystem = true;

var LZ = LZ || {};
LZ.ChoiceMessageSystem = LZ.ChoiceMessageSystem || {};
LZ.ChoiceMessageSystem.version = 1.00;

if (!Imported.LZ_Utils) throw new Error("Dependency LZ_Utils.js must be included");
if (LZ.Utils.version < 1) throw new Error(`LZ_Utils version ${LZ.Utils.version} has to be at least v1.00 or above`);

console.log(`LZ_ChoiceMessageSystem.js v${LZ.ChoiceMessageSystem.version} LOADED`);

//=============================================================================
// Game_Message
//=============================================================================

LZ.Game = LZ.Game || {};

LZ.Game.Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    LZ.Game.Message_clear.call(this);
    this._choicesCondition = [];
    this._choicesPreviews = [];
    this._originalChoiceList = [];
};

//=============================================================================
// Message_Choice
//=============================================================================

class Message_ChoiceOption {
    constructor(name, condition) {
        this._name = name;
        this._condition = condition;
    }
}

//new choice options added here
LZ.ChoiceMessageSystem.getAllChoices = function() {
    if (!this._allChoices) {
        this._allChoices = [
            {name:"intimidation", condition:"intimidation"},
            {name:"charisma", condition:"charisma"},
            {name:"yes", condition:null},
            {name:"no", condition:null},
            {name:"question", condition:null},
            {name:"back", condition:null},
            {name:"more", condition:null}
        ];
    }
    return this._allChoices;
}

//TODO: continue here
class Message_Choice {
    constructor(choice) {
        this._choice = choice;
        this._idKey = "<id:";
        this.setChoiceId();
        this.setChoiceName();
        this.setHandler();
        this.setConditionProperty();
        this.setValue();
        this.setText();
    }

    //if no id present, it assumes choice belongs to the first set of choices
    setChoiceId = function() {
        this._id = this._choice.includes(this._idKey) ? 
            Number(LZ.Utils.getStringFromString(this._choice, String(this._idKey), ">")) : 1;
    }

    setChoiceName = function() {
        this._choiceName = this._selectedChoice.name;
    }

    getSelectedChoice = function() {
        var allChoices = LZ.ChoiceMessageSystem.getAllChoices();
        for (let i = 0; i < allChoices; i++) {
            if (this._choice.includes(allChoices[i].name)) {
                return allChoices[i];
            }
        }
    }

    setText = function() {
        this._text = this._choice.replace(/<.+>/, "");
    }

    setHandler = function() {
        var allChoices = LZ.ChoiceMessageSystem.getAllChoices();
        for (let i = 0; i < allChoices.length; i++) {
            if (this._selectedChoice[i].name.test(this._choice)) {
                this._handler = this._selectedChoice[i].name.replace(/<.+>/, "");
            }
        }
    }

    setConditionProperty = function() {
        this._propertyCondition = this._selectedChoice.condition;
    }

    setValue = function() {
        this._value = Number(getStringFromString(choices[i], "<" + this._choiceName, ">"));
    }
}

LZ.Game.Message_setChoices = Game_Message.prototype.setChoices;
Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    this._choices = [];
    for (let i = 0; i < choices.length; i++) {
        this._choices.push(new Message_Choice(choices[i]));
    }
    
    LZ.Game.Message_setChoices.call(this, choices, defaultType, cancelType);
}

// Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
//     this._choices = choices;
//     this._choiceDefaultType = defaultType;
//     this._choiceCancelType = cancelType;
// };

// LZ.Game.Message_setChoices = Game_Message.prototype.setChoices;
// Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
//     console.log(choices);
//     console.log(defaultType);
//     console.log(cancelType);
//     var int = /<intimidation:/i;   //index 4
//     var cha = /<charisma:/i;       //index 0
//     var proceed = /<proceed>/i;   //index 1
//     var yes = /<yes>/i;           //index 3
//     var no = /<no>/i;             //index 2
//     var question = /<question>/i; //index 5
//     var back = /<back>/i;         //index 2
//     var more = /<more>/i;         //index 3
//     var id = /<id:/;
//     var aura = null;
//     var condition = {};
//     this._originalChoiceList = $gameMap._interpreter._list;
//     //$gameMap._interpreter.sortChoiceList();
//     for (i = 0; i < choices.length; i++) {
//         if (int.test(choices[i][0])) {
//             aura = "intimidation";
//             condition.id = id.test(choices[i][0]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = aura;
//             condition.aura = aura;
//             condition.value = Number(getStringFromString(choices[i], "<intimidation:", ">"));
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (cha.test(choices[i])) {
//             aura = "charisma";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = aura;
//             condition.aura = aura;
//             condition.value = Number(getStringFromString(choices[i], "<charisma:", ">"));
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (proceed.test(choices[i])) {
//             handler = "proceed";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (yes.test(choices[i])) {
//             handler = "yes";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (no.test(choices[i])) {
//             handler = "no";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (question.test(choices[i])) {
//             handler = "question";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (back.test(choices[i])) {
//             handler = "back";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else if (more.test(choices[i])) {
//             handler = "more";
//             condition.id = id.test(choices[i]) ? Number(LZ.Utils.getStringFromString(choices[i], "<id:", ">")) : 1;
//             condition.handler = handler;
//             condition.text = choices[i].replace(/<.+>/, "");
//             this._choicesCondition.push(condition);
//             var condition = {};
//         } else {
//             this._choicesCondition.push({});
//         }
//     }
//     LZ.Game.Message_setChoices.call(this, choices, defaultType, cancelType);
//     this._choices = this._choicesCondition.map((i) => i.text);
//     this.loadPreviews();
// };

Game_Message.prototype.loadPreviews = function() {
    var list = $gameMap._interpreter._list;
    var commandList = ["intimidation", "charisma", "proceed", "yes", "no", "question", "back", "more"];
    var previews = list.map((i) => i.parameters[0]).filter((k) => typeof k === "string" && k.includes("<preview:"));
    var id = /<id:/;             
    //creating preview objects
    for (i = 0; i < previews.length; i++) {
        var preview = "preview" + i;
        preview = {};
        preview.id = id.test(previews[i]) ? Number(LZ.Utils.getStringFromString(previews[i], "<id:", ">")) : 1;
        preview.handler = getStringFromString(previews[i], "<preview:", ">");
        preview.text = previews[i].replace(/<preview:.+>/, "");
        this._choicesPreviews.push(preview);
    }    
}; 

Game_Message.prototype.conditions = function() {
    return this._choicesCondition;
};

