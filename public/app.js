(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
const peopleEl = document.querySelector('.people');
const randomizeButtonEl = document.querySelector('button');
const formEl = document.querySelector('form');
const progressContainer = document.querySelector('.progress');
const progressEl = document.querySelector('progress');
progressContainer.remove();
const randInt = (exclMax) => Math.floor(Math.random() * exclMax);
const createSequenceProgress = (length, cb, done, perStep = 1000) => {
    progressEl.value = 0;
    progressEl.max = length;
    document.body.appendChild(progressContainer);
    let created = length;
    let values = [];
    const next = () => {
        for (let i = 0; i < perStep; i++) {
            if (!created) {
                progressEl.value = 0;
                progressEl.max = 0;
                progressContainer.remove();
                return done(values);
            }
            values.push(cb());
            created--;
            progressEl.value++;
        }
        setTimeout(() => next(), 0);
    };
    next();
};
const createPerson = (numEncounters, shinyRate) => {
    let shinies = 0;
    for (let i = 0; i < numEncounters; i++) {
        if (!randInt(shinyRate)) {
            shinies++;
        }
    }
    return { shinies };
};
const median = (arr) => {
    const mid = Math.floor(arr.length / 2);
    const nums = [...arr].sort((a, b) => a - b);
    return (arr.length % 2 ?
        (nums[mid - 1] + nums[mid]) / 2 :
        nums[mid]);
};
const addPeopleToDom = () => {
    if (!formEl.checkValidity())
        return;
    const formData = new FormData(formEl);
    const numPeople = Number(formData.get('numPeople'));
    const numEncounters = Number(formData.get('numEncounters'));
    const shinyRate = Number(formData.get('shinyRate'));
    peopleEl.innerHTML = '<h2>Results</h2>';
    createSequenceProgress(numPeople, () => createPerson(numEncounters, shinyRate), people => {
        let totalEncounters = 0;
        let totalShinies = 0;
        let worstCount = Number.MAX_SAFE_INTEGER;
        let bestCount = Number.MIN_SAFE_INTEGER;
        let zeroes = 0;
        let worstIndex = -1;
        let bestIndex = -1;
        let allRates = Array(numPeople);
        const peopleFragment = document.createDocumentFragment();
        people.forEach((person, i) => {
            const { shinies } = person;
            allRates[i] = shinies === 0 ? 0 : Math.floor(numEncounters / shinies);
            if (shinies === 0)
                zeroes++;
            if (shinies > bestCount) {
                bestCount = shinies;
                bestIndex = i;
            }
            if (shinies < worstCount) {
                worstCount = shinies;
                worstIndex = i;
            }
            totalEncounters += numEncounters;
            totalShinies += shinies;
        });
        const worst = people[worstIndex];
        const best = people[bestIndex];
        const summaryP = document.createElement('p');
        const averageRate = Math.round(totalEncounters / totalShinies);
        summaryP.innerHTML = `
        The difference between the best and worst luck was
        <strong>${best.shinies - worst.shinies}</strong> shiny
        Pokémon
        <br><br>
        The person with the best luck got
        <strong>${best.shinies}</strong> shiny Pokémon. Their rate was
        <strong>1:${Math.floor(numEncounters / best.shinies)}</strong>
        <br><br>
        The person with the worst luck got
        <strong>${worst.shinies}</strong> shiny Pokémon. Their rate was
        <strong>${worst.shinies === 0 ?
            `0:${numEncounters}` :
            `1:${Math.floor(numEncounters / worst.shinies)}`}</strong>
        <br></br>
        The average rate was <strong>1:${averageRate}</strong>
        <br><br>
        The median rate was <strong>1:${median(allRates)}</strong>
      `;
        if (zeroes > 0) {
            summaryP.innerHTML += `
          <br><br>
          ${zeroes} people got no shiny Pokémon. This is
          1:${Math.floor(numPeople / zeroes)} people, or
          ${((100 / numPeople) * zeroes).toFixed(2)}%
        `;
        }
        peopleEl.appendChild(summaryP);
        peopleEl.appendChild(peopleFragment);
    });
};
randomizeButtonEl.addEventListener('click', () => {
    addPeopleToDom();
});

},{}]},{},[1]);
