import { defineStore } from 'pinia'
import { getStateCandidates } from 'src/services/informedAPI'

export const useElectionStore = defineStore('election', {
  state: () => ({
    selectedState: null,
    selectedStateName: null,
    loading: false,
    error: null,
    filters: {
      party: 'all',
      office: 'all',
      district: 'all',
    },
    candidates: [],
  }),
  getters: {
    filteredCandidates: (state) => {
      if (!state.selectedState) return []

      return state.candidates.filter((c) => {
        const matchesState = c.state === state.selectedState
        const matchesParty =
          state.filters.party === 'all' || c.party.toLowerCase() === state.filters.party
        const matchesOffice =
          state.filters.office === 'all' || c.office.toLowerCase() === state.filters.office
        const matchesDistrict =
          state.filters.district === 'all' || c.district == state.filters.district

        return matchesState && matchesParty && matchesOffice && matchesDistrict
      })
    },
  },
  actions: {
    async selectState(stateCode, stateName = null) {
      this.selectedState = stateCode
      this.selectedStateName = stateName || stateCode
      if (stateCode) {
        await this.fetchCandidates(stateCode)
      }
    },
    async fetchCandidates(stateCode) {
      this.loading = true
      this.error = null
      try {
        const data = await getStateCandidates(stateCode)
        // Map API data to our store format
        this.candidates = data.map((c) => {
          const party = c.party_full ? c.party_full.toLowerCase() : ''
          const isDem = party.includes('democrat')
          const isRep = party.includes('republican')

          return {
            id: c.candidate_id,
            name: c.name,
            state: c.state,
            party: isDem ? 'Democrat' : isRep ? 'Republican' : c.party_full || 'Independent',
            office: c.office_full,
            incumbent: c.incumbent_challenge === 'I',
            challenger: c.incumbent_challenge === 'C',
            image:
              c.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`,
            receipts: c.receipts || 0,
            cash: parseFloat(c.cash_on_hand_end_period) || 0,
            district: c.district,
            bio: `Candidate for ${c.office_full} in ${c.state_full}${c.district && c.office == 'H' ? ` District ${c.district}` : ''}. ${c.incumbent_challenge === 'I' ? 'Incumbent' : 'Challenger'} with $${(parseFloat(c.cash_on_hand_end_period) || 0).toLocaleString()} cash on hand.`,
          }
        })
      } catch (err) {
        this.error = err.message
        console.error('Failed to fetch candidates:', err)
      } finally {
        this.loading = false
      }
    },
    setFilter(type, value) {
      this.filters[type] = value
    },
    clearFilters() {
      this.filters = { party: 'all', office: 'all', district: 'all' }
    },
  },
})
