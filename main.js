const state = {
    notes: [
        {
            note : 'Das ist eine Notiz',
            timestamp : new Date().toLocaleString(),
            edit: false
        }
    ]
}

const getters = {
    GetNotes () {
        return state.notes;

    },
    GetNoteCount () {
        return state.notes.length;
    }
}

const mutations = {
    STORE_NOTE (state, payload) {
        state.notes.push(payload);
    },

    DELETE_NOTE (state, index) {
        state.notes.splice(index, 1);
    },

    EDIT_NOTE (state, index) {
        state.notes.map ( note => {
            note.edit=false;
            // console.log(note.edit) ;
        })
        state.notes[index].edit = true;
        // console.log(state.notes[index].edit);

    },

    UPDATE_NOTE (state, noteneu) {
        console.log(noteneu);
        state.notes.map ( note => {
            note.edit ? note.note=noteneu : '';
            console.log(note.edit);
        })
        state.notes.map ( note => {
            note.edit=false;
            console.log(note.edit) ;
        })
    }
}

const actions = {
    StoreNote(context, payload) {
        context.commit('STORE_NOTE', payload);
    },

    DeleteNote(context, timestamp) {
        const index = context.state.notes.findIndex( note => note.timestamp === timestamp );
        context.commit('DELETE_NOTE', index);
    },

    EditNote(context, timestamp) {
        const index = context.state.notes.findIndex( note => note.timestamp === timestamp );
        context.commit('EDIT_NOTE', index);
    },

    UpdateNote (context, noteneu) {
        context.commit('UPDATE_NOTE', noteneu)
    }
}

const store = new Vuex.Store ({
    state,
    getters,
    mutations,
    actions
});


const NoteCountComp = {
    template: `
        <div>Anzahl der Notizen: {{noteCount}} </div>
    `,
    computed: {
        noteCount() {
            return this.$store.getters.GetNoteCount;
        }
    }
    
}

const InputComponent = {
    template: `
        <input 
            type="text"
            class="form-control mt-2"
            :placeholder="placeholder"
            v-model="note"
            @keyup.enter="SubmitNote"
        >
    `,
    props: ['placeholder'],

    data(){
        return {
            note: ''
        }
    },

    methods: {
        SubmitNote() {
            const newNote = {
                note: this.note,
                timestamp: new Date().toLocaleString(),
                edit: false
            }
            this.$store.dispatch('StoreNote', newNote)
            this.note='';
        }
    }
}

new Vue({

    el: '#app',

    store,

    components: {
        'input-component': InputComponent,
        'notecount-comp' : NoteCountComp
    },

    data: {
        placeholder: 'Gib hier eine neue Notiz ein:',
        noteneu : ''
    },

    computed: {
        notes () {
            return this.$store.getters.GetNotes;
        }
    },

    methods: {
        DeleteNote (notetimestamp) {
            this.$store.dispatch('DeleteNote', notetimestamp)
        },
        Bearbeiten (notetimestamp) {
            this.$store.dispatch('EditNote', notetimestamp)
        },
        Ubernehmen (noteneu) {
            this.$store.dispatch('UpdateNote', noteneu)
        }
    }


});