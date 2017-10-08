import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        tours: [],
        bookings: [],
        errorMessage: ''
    },
    getters: {
        errorMessage(state) {
            return state.errorMessage;
        },
        tours(state) {
            return state.tours;
        },
        bookings(state) {
            return state.bookings;
        }
    },
    mutations: {
        handleError(state, payload) {
            if (payload.error.response) {
                // Response falls out of the range of 2xx
                state.errorMessage = (payload.message) ? payload.message : 'There was a problem handling this request.';
            } else if (payload.error.request) {
                // No response received
                state.errorMessage = 'Could not reach the server.';
            }

            return false;
        },
        clearError(state) {
            state.errorMessage = '';
        },
        updateTours(state, payload) {
            state.tours = payload;
        },
        updateBookings(state, payload) {
            state.bookings = payload;
        },
        updateStatus(state, payload) {
            state.bookings.find(booking => booking.id === payload.booking.id).status = (payload.booking.status === payload.newStatus) ? 1 : payload.newStatus;
        }
    },
    actions: {
        getTours(context) {
            axios.get('http://localhost:3000/tours').then((response) => {
                context.commit('updateTours', response.data);
            }).catch(error => context.commit('handleError', { error, message: 'There was a problem loading tours.' }));
        },
        getBookings(context) {
            axios.get('http://localhost:3000/bookings?_expand=user').then((response) => {
                context.commit('updateBookings', response.data);
            }).catch(error => context.commit('handleError', { error, message: 'There was a problem loading bookings.' }));
        },
        setStatus(context, payload) {
            const originalStatus = payload.booking.status;

            // Toggle the status on or off
            context.commit('updateStatus', payload);

            axios.patch('http://localhost:3000/bookings/'+payload.booking.id, {
                status: payload.booking.status
            }).catch((error) => {
                context.commit('updateStatus', { booking: payload.booking, newStatus: originalStatus });
                context.commit('handleError', { error, message: 'There was a problem changing the booking status.' });
            });
        },
        createUser(context, payload) {
            return axios.post('http://localhost:3000/users', {
                firstname: payload.firstname,
                surname: payload.surname
            });
        },
        createBooking(context, payload) {
            return context.dispatch('createUser', { firstname: payload.firstname, surname: payload.surname }).then((response) => {
                return axios.post('http://localhost:3000/bookings', {
                    tourId: payload.tour,
                    userId: response.data.id,
                    quantity: payload.qty,
                    status: 1
                });
            }).then(response => true).catch(error => context.commit('handleError', { error, message: 'There was a problem creating the booking.' }));
        }
    }
});