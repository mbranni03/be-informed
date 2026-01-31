import { defineStore } from 'pinia'
import { Cookies } from 'quasar'
import { getStateCandidates, lookupDistrict } from 'src/services/InformedAPI'

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
    currentLegislators: [],
    userZip: null,
    userState: null,
    userDistrict: null,
    localCandidates: [],
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
    mapCandidate(c) {
      const party = c.party_full ? c.party_full.toLowerCase() : ''
      const isDem = party.includes('democrat')
      const isRep = party.includes('republican')

      return {
        id: c.candidate_id,
        name: c.name,
        state: c.state,
        party: isDem ? 'Democrat' : isRep ? 'Republican' : c.party_full || 'Independent',
        office: c.office_full,
        officeCode: c.office,
        incumbent: c.incumbent_challenge === 'I',
        challenger: c.incumbent_challenge === 'C',
        image:
          c.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`,
        receipts: c.receipts || 0,
        cash: parseFloat(c.cash_on_hand_end_period) || 0,
        district: c.district,
        stateName: c.state_full,
        bio: `Candidate for ${c.office_full} in ${c.state_full}${c.district && c.office == 'H' ? ` District ${c.district}` : ''}. ${c.incumbent_challenge === 'I' ? 'Incumbent' : 'Challenger'} with $${(parseFloat(c.cash_on_hand_end_period) || 0).toLocaleString()} cash on hand.`,
      }
    },
    async selectState(stateCode, stateName = null) {
      this.selectedState = stateCode
      this.selectedStateName = stateName || stateCode
      if (stateCode) {
        await this.fetchCandidates(stateCode)
      }
    },
    async initFromCookies() {
      const savedZip = Cookies.get('informed_user_zip')
      if (savedZip) {
        try {
          await this.lookupByZip(savedZip, { skipSave: true })
        } catch (e) {
          console.error('Failed to init from cookie zip:', e)
        }
      }
    },
    async fetchCandidates(stateCode) {
      this.loading = true
      this.error = null
      try {
        const data = await getStateCandidates(stateCode)
        this.candidates = data.map((c) => this.mapCandidate(c))
      } catch (err) {
        this.error = err.message
        console.error('Failed to fetch candidates:', err)
      } finally {
        this.loading = false
      }
    },
    async lookupByZip(zip, options = {}) {
      this.loading = true
      this.error = null
      try {
        const data = await lookupDistrict(zip)
        this.currentLegislators = data.current || []

        if (!options.skipSave) {
          Cookies.set('informed_user_zip', zip, {
            expires: 365,
            secure: true,
            sameSite: 'Strict',
          })
        }
        this.userZip = zip

        if (data.state) {
          this.userState = data.state
          this.userDistrict = data.district
          await this.selectState(data.state)

          if (data.district) {
            this.setFilter('district', data.district)
          }

          // Also fetch local candidates for the "My Location" feature
          const localData = await getStateCandidates(data.state)
          this.localCandidates = localData.map((c) => this.mapCandidate(c))
        }
        return data
      } catch (err) {
        this.error = err.message
        console.error('Failed to lookup zip:', err)
        throw err
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
