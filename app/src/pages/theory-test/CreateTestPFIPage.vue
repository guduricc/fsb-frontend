<template>
  <q-page padding>
    <q-card>
      <q-card-section>
        <BaseHeader icon="quiz" title="Theory test creation"></BaseHeader>
      </q-card-section>
      <q-separator inset/>
      <q-card-section>
              <q-card class="q-pa-md" >
                <div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
                <q-card-section style="min-width: 300px">
                  <q-select style="max-width: 400px" filled v-model="league" multiple :options="leagueOptions" label="League" hint="Select the league" />
                </q-card-section>
                  <q-card-section style="min-width: 300px">
                    <q-select style="max-width: 400px" filled v-model="refereeType" multiple :options="refereeTypeOptions" label="Referee type" hint="Select referee type" />
                  </q-card-section>
                <q-card-section style="min-width: 300px">
                  <q-input filled v-model="date" hint="Select the test date"  readonly>
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer" color="primary">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                          <q-date v-model="date" mask="DD.MM.YYYY"  no-unset>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Ok" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>
                <q-card-section style="min-width: 300px">
                  <q-input filled v-model="startTime" mask="time" :rules="['time']" hint="Select the test start time" readonly>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer" color="green">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="startTime">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Ok" color="primary" flat />
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </q-card-section>
                  <q-card-section style="min-width: 300px">
                    <q-input filled v-model="endTime" mask="time" :rules="['time']" hint="Select the test end time" readonly>
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer" color="red">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="endTime">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Ok" color="primary" flat />
                              </div>
                            </q-time>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-card-section>
                </div>

                <q-separator inset style="margin-bottom: 10px"/>

                <q-card-section  class="bg-blue-grey-1 q-pa-md"
                                 style="border-radius: 20px; margin-bottom: 10px"
                  v-for="(question, index) in questions" :key="question"
                >
                  <div style="width: 100%">
                  <span class="text-h6" style="margin-bottom: 122px">{{index+1 + '. Question'}}</span>
                  <q-input
                    style="margin: 10px 0; width: 100%"
                    filled
                    v-model="question.question_text"
                    label="Question"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'This field cannot be empty!']"
                    dense
                    type="textarea"
                  />

                    <q-item dense v-for="(answers,index2) in question.answers" :key="answers">
                      <q-item-section>
                        <q-input
                          dense
                          style="width: 100%"
                          filled
                          v-model.trim="answers.answer_text"
                          :label="`Offered answer ${index2+1}`"
                          lazy-rules
                          hint=""
                          type="text"
                        />
                      </q-item-section>
                      <q-item-section side >
                        <q-toggle color="green" v-model="answers.is_correct"
                                  @update:model-value="updateAnswers(index,index2)"/>
                      </q-item-section>
                    </q-item>

                  </div>
                  <div style="display: flex; justify-content: space-between">
                    <div></div>
                    <q-btn :disable="questions.length===1" class="q-ma-md" rounded color="red" label="Delete question" @click="deleteQuestion(index)"/>
                  </div>
                </q-card-section>
                <div style="display: flex; justify-content: center">
                  <div></div>
                  <q-btn color="green" round icon="add" @click="addNewQuestion()"/>
                </div>
              </q-card>
      </q-card-section>
      <q-card-section style="display: flex; justify-content: space-between">
        <div></div>
        <q-btn size='lg' class="q-ma-md" rounded color="primary" label="Save test" @click="submit"/>

      </q-card-section>
    </q-card>

  </q-page>
</template>

<script setup lang="ts">
import BaseHeader from 'components/BaseHeader.vue'
import {ref} from "vue";
import {useCurrentDate, useDBFormat, useUIFormat} from "src/utils/dateHook";
import useNotificationMessage from "src/composables/notificationMessage";
import {useTheoryAndVideoTestStore} from "stores/theoryAndVideoTestStore";
import {useRoute} from "vue-router";

const route = useRoute();
const theoryTestStore = useTheoryAndVideoTestStore();

let date = ref(useCurrentDate());
let startTime = ref('10:00');
let endTime = ref('11:00');

const leagueOptions = ['FIRST LEAGUE','SECOND LEAGUE','THIRD LEAGUE'];
let league = ref<string[]>([]);

const refereeTypeOptions = ['REFEREE', 'ASSISTANT REFEREE','DELEGATE'];
let refereeType = ref<string[]>([]);

let questions = ref([
  {
    question_text: '',
    answers: [
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false}
    ],
  },
])

if(route.params.id){
  showTest();
}

async function showTest(){
  const test =  await theoryTestStore.showTest(String(route.params.id));
  if(test){
    date.value = useUIFormat(test.start_date.substring(0,10))
    const timeZone = new Date().getTimezoneOffset() / 60;
    const startTimeHours = Number(test.start_date.substring(11,13)) - timeZone < 10 ?
      '0'+(Number(test.start_date.substring(11,13)) - timeZone) : Number(test.start_date.substring(11,13)) - timeZone
    const endTimeHours = Number(test.end_date.substring(11,13)) - timeZone < 10 ?
      '0'+(Number(test.end_date.substring(11,13)) - timeZone) : Number(test.end_date.substring(11,13)) - timeZone
    startTime.value = startTimeHours+':'+test.start_date.substring(14,16)
    endTime.value = endTimeHours+':'+test.end_date.substring(14,16)
    league.value = test.league
    refereeType.value = test.role
    questions.value = test.theory_questions
  }
}



function addNewQuestion(){
  questions.value.push({
    question_text: '',
    answers: [
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false},
      {answer_text: '',is_correct: false}
    ],
  })
}

function deleteQuestion(index: number){
  questions.value.splice(index,1);
}

function updateAnswers(index: number,correctAnswer: number){
  switch (correctAnswer){
    case 0 :
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      questions.value[index].answers[3].is_correct= false;
      break;
    case 1 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      questions.value[index].answers[3].is_correct = false;
      break;
    case 2 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[3].is_correct = false;
      break;
    case 3 :
      questions.value[index].answers[0].is_correct = false;
      questions.value[index].answers[1].is_correct = false;
      questions.value[index].answers[2].is_correct = false;
      break;
  }
}


async function submit(){
  if(!validationSuccessful()){
    return;
  }


  const startDate = new Date(useDBFormat(date.value)+'T'+startTime.value+':00');
  const endDate = new Date(useDBFormat(date.value)+'T'+endTime.value+':00');


  const request = {
    name: 'Test: ' + date.value + ' ' + startTime.value,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    league: [...league.value],
    role: [...refereeType.value],
    theory_questions: [...questions.value]
  }

  request.theory_questions.forEach(el => {
    for (let i = el.answers.length - 1; i >= 0; i--) {
      const answer = el.answers[i];
      if (!answer.is_correct && answer.answer_text === '') {
        el.answers.splice(i, 1);
      }
    }
  });

  if(route.params.id){
    await theoryTestStore.updateTheoryTest(String(route.params.id),request);

  }else{
    await theoryTestStore.storeTheoryTest(request);

    league.value = []
    refereeType.value = []
    date.value = useCurrentDate();
    startTime.value = '10:00';
    endTime.value = '11:00';
    questions.value = [  {
      question_text: '',
      answers: [
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false},
        {answer_text: '',is_correct: false}
      ],
    }]
  }




}


function validationSuccessful(){

  if(endTime.value <= startTime.value){
    useNotificationMessage('error','The test end time must be later than the test start time!');
    return false;
  }

  if(!league.value || league.value.length === 0){
    useNotificationMessage('error','You have not entered the league!');
    return false;
  }

  if(!refereeType.value ||  league.value.length === 0){
    useNotificationMessage('error','You have not entered the referee type!');
    return false;
  }

  //empty question exists
  const index = questions.value.findIndex(el => el.question_text === '');
  if(index !== -1){
    useNotificationMessage('error','Question number ' + Number(Number(index)+1) + ' is empty!');
    return false;
  }

  // validation for question passed

  //minimum 2 questions

  const index4 = questions.value.findIndex(el => {
    let nonEmptyAnswers = el.answers.filter(answer =>  answer.answer_text !== '')
    return nonEmptyAnswers.length < 2
  })
  if(index4 !== -1){
    useNotificationMessage('error','For question number ' + Number(Number(index4)+1) + ' you must enter at least 2 answers!');
    return false;
  }


  // validation for answers passed

  const index3 = questions.value.findIndex(el => {
    return el.answers.every(answer => !answer.is_correct);
  });

  if(index3 !== -1){
    useNotificationMessage('error','The correct answer is not marked for question number ' + Number(Number(index3)+1) + '!');
    return false;
  }

  return true;
}


</script>

<style scoped>

</style>
