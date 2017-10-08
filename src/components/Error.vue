<template>
    <div class="error" v-if="errorMessage">
        <p>{{ errorMessage }}</p>
        <button type="button" @click="clearError()">Clear</button>
    </div>
</template>

<script>
export default {
    computed: {
        errorMessage() {
            return this.$store.getters.errorMessage;
        }
    },
    methods: {
        clearError() {
            this.$store.commit('clearError');
        }
    }
}
</script>

<style lang="scss">
@import '../css/_helpers.scss';

.error {
    overflow: hidden;
	background: #FA0505;
    margin: 10px 0;
    padding: 10px;
    text-align: center;
    color: $secondaryTextColour;

    p {
        font-size: convert(20);
        margin: 0 0 0.5em;
    }

    button {
        padding: 7px 10px;
        font-size: convert(13);
    }
}
</style>