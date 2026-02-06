// ######## ##     ## ########  ########
// ##        ##   ##  ##     ##    ##
// ##         ## ##   ##     ##    ##
// ######      ###    ########     ##
// ##         ## ##   ##           ##
// ##        ##   ##  ##           ##
// ######## ##     ## ##           ##

const FORMAL = true;

const EXPERIMENT_NAME = 'upright';
const SUBJ_NUM_FILE = 'subjNum_' + EXPERIMENT_NAME + '.txt';
const TRIAL_FILE = 'trial_' + EXPERIMENT_NAME + '.txt';
const SUBJ_FILE = 'subj_' + EXPERIMENT_NAME + '.txt';
const VISIT_FILE = 'visit_' + EXPERIMENT_NAME + '.txt';
const ATTRITION_FILE = 'attrition_' + EXPERIMENT_NAME + '.txt';
const SAVING_SCRIPT = 'save.php';
const SAVING_DIR_HOME = '~/data';
const SAVING_DIR = FORMAL ? SAVING_DIR_HOME +'/formal' : SAVING_DIR_HOME +'/testing';
const ID_GET_VARIABLE_NAME = 'id';
const REDIRECT_LINK = '';

const VIEWPORT_MIN_W = 800;
const VIEWPORT_MIN_H = 600;

const INSTR_READING_TIME_MIN = 0.5;

const STIM_PATH = 'Stimuli/Stimuli_' + EXPERIMENT_NAME + '/';

// trial
const PRACTICE_LIST = []; // = ['source0.png'];
const PRACTICE_TRIAL_N = 0; // = PRACTICE_LIST.length;
const TESTING_IMAGE_N = 3;

const EXPERIMENTS = {
    SCRAMBLED: 'scrambled',
    LEGO_LIKE: 'lego_like',
};

let SOURCE_LIST = [];

function createSourceList() {
    switch (EXPERIMENT_NAME) {
        case EXPERIMENTS.SCRAMBLED:
            return createScrambledList();

        case EXPERIMENTS.LEGO_LIKE:
            return createLegoLikeList();

        default:
            return createDefaultList();
    }
}

function createScrambledList() {
    const CLASSES = ['airplane', 'car', 'chair', 'lamp', 'table'];
    const MODELS = ['dgcnn', 'point_transformer'];
    const NUM_STIMULI_PER_CLASS = 10;

    const fileNames = [];

    for (const model of MODELS) {
        for (const cls of CLASSES) {
            for (let idx = 1; idx <= NUM_STIMULI_PER_CLASS; idx++) {
                fileNames.push(`${model}/${cls}_${idx}_normal.gif`);
                fileNames.push(`${model}/${cls}_${idx}_scrambled.gif`);
            }
        }
    }

    const shuffled = SHUFFLE_ARRAY(fileNames);
    return FORMAL ? shuffled : shuffled.slice(0, TESTING_IMAGE_N);
}

function createLegoLikeList() {
    const CLASSES = [
        'airplane', 'bottle', 'bowl', 'chair', 'cup',
        'lamp', 'person', 'piano', 'stool', 'table',
    ];

    const VOXEL_SIZES = ['0.01', '0.05', '0.1', '0.2'].map(String);
    const INDICES = VOXEL_SIZES.map((_, i) => String(i + 1));

    const fileNames = [];

    for (const cls of CLASSES) {
        const shuffledIndices = SHUFFLE_ARRAY(INDICES);

        for (let j = 0; j < shuffledIndices.length; j++) {
            fileNames.push(`${cls}_${shuffledIndices[j]}_voxel_${VOXEL_SIZES[j]}.gif`);
        }
    }

    return FORMAL ? SHUFFLE_ARRAY(fileNames) : fileNames.slice(0, 5);
}

function createDefaultList() {
    const IMAGE_N = 70;
    const n = FORMAL ? IMAGE_N : TESTING_IMAGE_N;
    return SHUFFLE_ARRAY(RANGE(1, n + 1)).map((x) => `/stimuli_${x}.gif`);
}

SOURCE_LIST = createSourceList();

const TRIAL_N = SOURCE_LIST.length;
const REST_TRIAL_N = Math.ceil(SOURCE_LIST.length/2);
const INTERTRIAL_INTERVAL = 0.5;

// Object variables
var instr, subj, trial;


// ########  ########    ###    ########  ##    ##
// ##     ## ##         ## ##   ##     ##  ##  ##
// ##     ## ##        ##   ##  ##     ##   ####
// ########  ######   ##     ## ##     ##    ##
// ##   ##   ##       ######### ##     ##    ##
// ##    ##  ##       ##     ## ##     ##    ##
// ##     ## ######## ##     ## ########     ##

$(document).ready(function() {
    subj = new subjObject(subj_options); // getting subject number
    subj.id = subj.getID(ID_GET_VARIABLE_NAME);
    subj.saveVisit();
    if (subj.phone) {
        $('#instrText').html('It seems that you are using a touchscreen device or a phone. Please use a laptop or desktop instead.<br /><br />If you believe you have received this message in error, please contact the experimenter at [email]<br /><br />Otherwise, please switch to a laptop or a desktop computer for this experiment.');
        $('#nextButton').hide();
        $('#instrBox').show();
    } else if (subj.id !== null){
        $('#pledgeBox').show();
    } else {
        // $('#instrText').html("We can't identify a valid ID. Please reopen the study from the sona website again. Thank you!");
        // $('#nextButton').hide();
        // $('#instrBox').show();
        $('#pledgeBox').show();
    }
});


//  ######  ##     ## ########        ## ########  ######  ########
// ##    ## ##     ## ##     ##       ## ##       ##    ##    ##
// ##       ##     ## ##     ##       ## ##       ##          ##
//  ######  ##     ## ########        ## ######   ##          ##
//       ## ##     ## ##     ## ##    ## ##       ##          ##
// ##    ## ##     ## ##     ## ##    ## ##       ##    ##    ##
//  ######   #######  ########   ######  ########  ######     ##

const SUBJ_TITLES = ['num',
                     'date',
                     'startTime',
                     'id',
                     'userAgent',
                     'endTime',
                     'duration',
                     'instrQAttemptN',
                     'instrReadingTimes',
                     'quickReadingPageN',
                     'hiddenCount',
                     'hiddenDurations',
                     'serious',
                     'problems',
                     'gender',
                     'age',
                     'inView',
                     'viewportW',
                     'viewportH'
                    ];

function SUBMIT_PLEDGE_Q() {
    var pledge_response = $('input[name=pledge]:checked').val();
    var responded = CHECK_IF_RESPONDED([], [pledge_response]);
    if (responded) {
        $('#pledgeBox').hide();
        if (pledge_response == 1){
            ACCEPT_PLEDGE()
        } else {
            REFUSE_PLEDGE();
        }
    } else {
        $('#pledgeQWarning').text('Please answer the question to start the experiment. Thank you!');
    }
}

function ACCEPT_PLEDGE() {
    instr = new instrObject(instr_options);
    instr.start();
    trial_options['subj'] = subj;
    trial = new trialObject(trial_options);
}

function REFUSE_PLEDGE() {
    $('#instrText').html('It seems that you have reported that you will not read the instructions carefully. In that case, you will not be fully informed and thus we are not allowed to let you participate because of the ethical concerns.<br /><br /> We are sorry that we have to ask you to cancel your sign-up.');
    $('#nextButton').hide();
    $('#instrBox').show();
}

function HANDLE_VISIBILITY_CHANGE() {
    if (document.hidden) {
        subj.hiddenCount += 1;
        subj.hiddenStartTime = Date.now();
    } else  {
        subj.hiddenDurations.push((Date.now() - subj.hiddenStartTime)/1000);
    }
}

function SUBMIT_DEBRIEFING_Q() {
    subj.serious = $('input[name=serious]:checked').val();
    subj.problems = $('#problems').val();
    subj.gender = $('input[name=gender]:checked').val();
    subj.age = $('#age').val();
    var open_ended_attribute_names = ['age', 'problems'];
    var open_ended_list = [subj.age, subj.problems];
    var choice_list = [subj.serious, subj.gender];
    var all_responded = CHECK_IF_RESPONDED(open_ended_list, choice_list);
    if (all_responded) {
        for (var i = 0; i < open_ended_attribute_names.length; i++) {
            subj[open_ended_attribute_names[i]] = subj[open_ended_attribute_names[i]].replace(/(?:\r\n|\r|\n)/g, '<br />');
        }
        subj.instrQAttemptN = instr.qAttemptN['onlyQ'];
        subj.instrReadingTimes = JSON.stringify(instr.readingTimes);
        subj.quickReadingPageN = Object.values(instr.readingTimes).filter(d => d < INSTR_READING_TIME_MIN).length;
        subj.submitQ();
        $('#questionsBox').hide();
        ALLOW_SELECTION();
        $('#debriefingBox').show();
        $('html')[0].scrollIntoView();
    } else {
        $('#QWarning').text('Please answer all the questions. Thank you!');
    }
}

function END_TO_PROLIFIC() {
    window.location.href = REDIRECT_LINK + subj.id;
}

function ALLOW_SELECTION() {
    $('body').css({
        '-webkit-user-select':'text',
        '-moz-user-select':'text',
        '-ms-user-select':'text',
        'user-select':'text'
    });
}

var subj_options = {
    subjNumFile: SUBJ_NUM_FILE,
    titles: SUBJ_TITLES,
    viewportMinW: VIEWPORT_MIN_W,
    viewportMinH: VIEWPORT_MIN_H,
    savingScript: SAVING_SCRIPT,
    visitFile: VISIT_FILE,
    attritionFile: ATTRITION_FILE,
    subjFile: SUBJ_FILE,
    savingDir: SAVING_DIR,
    handleVisibilityChange: HANDLE_VISIBILITY_CHANGE
};


// #### ##    ##  ######  ######## ########
//  ##  ###   ## ##    ##    ##    ##     ##
//  ##  ####  ## ##          ##    ##     ##
//  ##  ## ## ##  ######     ##    ########
//  ##  ##  ####       ##    ##    ##   ##
//  ##  ##   ### ##    ##    ##    ##    ##
// #### ##    ##  ######     ##    ##     ##

var instr_text = new Array;
instr_text[0] = 'Thank you very much!<br /><br />This study will take about 20 minutes. Please read the instructions carefully, and avoid using the refresh or back buttons.';
instr_text[1] = 'Now, please maximize your browser window.';
instr_text[2] = 'Please also turn off any music you are playing and minimize outside distractions. Distractions are ' +
    'known to have effects on this kind of studies and it will make our data unusable.<br /><br />This project does ' +
    'not have any sound so do not worry about not hearing anything.';
instr_text[3] = 'You will be shown a rotating object represented in a point cloud format. Here is an example of a plant.';
instr_text[4] = 'After viewing the object in the point cloud display for 3 seconds, several buttons each with a ' +
    'different object name will appear below the display window. You should click the button that best describes ' +
    'the object. In each trial, the number of points varies. So it is normal that you find it difficult to recognize ' +
    'the object in some trials. If you are unsure about the object categories, please randomly select an ' +
    'answer.<br /><br />In this example, the correct response is to click on the “plant” button.'
instr_text[5] = "Great! You can press SPACE to start.<br /><br />Please focus after you start (Don't switch to other windows or tabs!)";

const INSTR_FUNC_DICT = {
    1: SHOW_MAXIMIZE_WINDOW,
    2: HIDE_INSTR_IMG,
    3: SHOW_EXAMPLE_IMG,
    4: SHOW_BUTTONS,
    // 6: SHOW_INSTR_QUESTION,
    5: SHOW_CONSENT
};

function SHOW_INSTR_IMG(file_name) {
    $('#instrImg').attr('src', STIM_PATH + file_name);
    $('#instrImg').css('display', 'block');
}

function SHOW_EXAMPLE_IMG() {
    $('#instrGif').attr('src', STIM_PATH + 'example.gif');
    $('#instrGif').css('display', 'block');
}

function HIDE_INSTR_IMG() {
    $('#instrImg').css('display', 'none');
    $('#instrGif').css('display', 'none');
}

function SHOW_BUTTONS() {
    $('#nextButton').css('display', 'none');
    $('#instr_button').css('display', 'block');
    const buttons = document.getElementsByTagName("button");
    const buttonPressed = e => {
        choice = e.target.id;
        if(choice === 'instr7'){
            HIDE_INSTR_IMG();
            $('#instr_button').css('display', 'none');
            $('#instrWarning').text('');
            instr.next();
        } else {
            $('#instrWarning').text('Please click on the “Plant” button. Thank you!');
        }
    }
    for (let button of buttons) {
        button.addEventListener("click", buttonPressed);
    }
}

function SHOW_MAXIMIZE_WINDOW() {
    SHOW_INSTR_IMG('maximize_window.png');
}

function SUBMIT_INSTR_Q() {
    var instrChoice = $('input[name="instrQ"]:checked').val();
    if (typeof instrChoice === 'undefined') {
        $('#instrQWarning').text('Please answer the question. Thank you!');
    } else if (instrChoice != 'option3') {
        instr.qAttemptN['onlyQ'] += 1;
        instr.saveReadingTime();
        $('#instrText').html('You have given an incorrect answer. Please read the instructions again carefully.');
        $('#instrBox').show();
        $('#instrQBox').hide();
        $('#playButton').removeClass('dimButton').addClass('button');
        $('#instrVideo')[0].currentTime = 0;
        $('#playButton').mouseup(VIDEO_PLAY);
        $('input[name="instrQ"]:checked').prop('checked', false);
        instr.index = -1;
    } else {
        instr.saveReadingTime();
        instr.next();
        $('#instrQBox').hide();
        $('#instrBox').show();
    }
}

function SHOW_CONSENT() {
    $('#nextButton').hide();
    $('#consentBox').show();
    $('#instrBox').show();
    $(document).keyup(function(e) {
        if (e.which == 32) { // the 'space' key
            $(document).off('keyup');
            instr.saveReadingTime();
            $('#instrBox').hide();
            $('#consentBox').hide();
            subj.saveAttrition();
            SHOW_TRIALS();
        }
    });
}

var instr_options = {
    text: instr_text,
    funcDict: INSTR_FUNC_DICT,
    qConditions: ['onlyQ']
};


// ######## ########  ####    ###    ##
//    ##    ##     ##  ##    ## ##   ##
//    ##    ##     ##  ##   ##   ##  ##
//    ##    ########   ##  ##     ## ##
//    ##    ##   ##    ##  ######### ##
//    ##    ##    ##   ##  ##     ## ##
//    ##    ##     ## #### ##     ## ########

const TRIAL_TITLES = [
    'num',
    'date',
    'subjStartTime',
    'trialNum',
    'stimName',
    'choice',
];

function SHOW_TRIALS() {
    // $('#trialBox').show();
    subj.detectVisibilityStart();

    const buttons = document.getElementsByTagName("button");
    const buttonPressed = e => {
        trial.choice = e.target.id;
        END_THIS_TRIAL();
    }
    for (let button of buttons) {
        button.addEventListener("click", buttonPressed);
    }

    trial.run();
}


function TRIAL_UPDATE(formal_trial, last, this_trial, next_trial, path) {
    $('#button-group').css('display', 'none');

    trial.stimName = this_trial;
    $('#trialProgress').text(trial.progress);
    $('#testImg').attr('src', STIM_PATH + this_trial);

    if (!last) {
        $('#bufferImg').attr('src', STIM_PATH + next_trial);
    }

    $(document).ready(function() {
        setTimeout(function() {
            $("#button-group").css('display', 'block');
        }, 3000);
    });
}


function TRIAL() {
    $('#trialBox').show();
}


function END_THIS_TRIAL() {
    // $('#trialBox').hide();
    if (trial.trialNum > 0) {
        const DATA = LIST_FROM_ATTRIBUTE_NAMES(trial, trial.titles);
        trial.allData += LIST_TO_FORMATTED_STRING(DATA);
    }
    CHECK_TO_REST();
}

function CHECK_TO_REST() {
    if (trial.trialNum < trial.trialN) {
        if (trial.trialNum % REST_TRIAL_N == 0 && trial.trialNum > 0) {
                REST();
        } else {
            trial.run();
        }
    } else {
        trial.endExptFunc();
    }
}

function REST() {
    $('#trialBox').hide();
    subj.detectVisibilityEnd();
    trial.rest($('#restBox'), $('#restText'), function() {
        $('#trialBox').show();
        subj.detectVisibilityStart();
        trial.run();
    });
}

function END_TRIALS() {
    $('#trialBox').hide();
    $('#questionsBox').show();
    subj.detectVisibilityEnd();
    trial.save();
}

var trial_options = {
    subj: 'pre-post',
    titles: TRIAL_TITLES,
    pracTrialN: PRACTICE_TRIAL_N,
    trialN: TRIAL_N,
    stimPath: STIM_PATH,
    dataFile: TRIAL_FILE,
    savingScript: SAVING_SCRIPT,
    savingDir: SAVING_DIR,
    trialList: SOURCE_LIST,
    pracList: PRACTICE_LIST,
    intertrialInterval: INTERTRIAL_INTERVAL,
    updateFunc: TRIAL_UPDATE,
    trialFunc: TRIAL,
    endExptFunc: END_TRIALS,
    progressInfo: true
}