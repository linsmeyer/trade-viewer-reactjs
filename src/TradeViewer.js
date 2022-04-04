import React from 'react'
import {createSelector} from 'reselect'

import Api from './Services/Api'
import SelectorOfStatistcs from './Components/SelectorOfStatistcs'
import TableOfStatistics from './Components/TableOfStatistics'

const TradeViewer = ({loading, cities, modes, city, mode, statistics, onSelect, onRequestStatistics}) => (
    <div>
        <SelectorOfStatistcs
            label={'Select the City: '}
            name={'city'}
            dataKey={'city'}
            onSelect={onSelect}
            options={cities}/>
        <SelectorOfStatistcs
            label={'And the Consult Mode: '}
            name={'mode'}
            dataKey={'mode'}
            onSelect={onSelect}
            options={modes}/>
        <button
            type="button"
            disabled={!city || !mode}
            onClick={() => onRequestStatistics(city, mode)}>
            Show Statistics
        </button>
        {loading && <p>Loading...</p>}
        <TableOfStatistics data={statistics}/>
    </div>
)
const withDataFetching = Component => class App extends React.Component {
    constructor() {
        super()
        this.state = {
            domain: {
                onRequestStatistics: this.getStatistics.bind(this),
                onSelect: this.onSelect.bind(this)
            },
            ui: {
                loading: false,
                error: null,
                cities: [],
                modes: [],
                city: null,
                mode: null
            },
            data: {
                keys: [],
                statistics: {}
            }
        }
    }

    componentDidMount() {
        this.getKeys()
    }

    selectKeys = payload => payload.keys
    selectStatistics = state => state.data.statistics
    // selectcities = state => state.ui.cities
    selectmodes = state => state.ui.modes
    selectCityFromKeys = createSelector(
        this.selectKeys,
        keys => [...new Set(keys.map(p => p.city))]
    )
    selectModesByCity = city => createSelector(
        this.selectKeys,
        keys => keys
            .filter(p => p.city === city)
            .map(p => p.mode)
    )
    onLoading = (callback, ...params) => this.setState({
        ui: {
            ...this.state.ui,
            error: null,
            loading: true
        }
    }, () => callback(...params))
    onKeysSuccess = (keys = []) => {
        this.setState({
            ui: {
                ...this.state.ui,
                loading: false,
                error: null,
                cities: this.selectCityFromKeys({keys}),
                city: keys[0].city
            },
            data: {
                ...this.state.data,
                keys
            }
        }, () => this.onSetDefaultMode(this.state.ui.cities[0]))
    }
    onError = error => this.setState({
        ui: {
            ...this.state.ui,
            error,
            loading: false
        }
    })
    onStatisticsSuccess = statistics => this.setState({
        data: {
            ...this.state.data,
            statistics
        },
        ui: {
            ...this.state.ui,
            loading: false
        }
    })
    onSetDefaultMode = (city) => {
        const modes = this.selectModesByCity(city)(this.state.data)
        this.setState({
            ui: {
                ...this.state.ui,
                modes,
                mode: modes[0]
            }
        })
    }
    onSelect = ({target}) => {
        const {name, value} = target
        this.setState({
            ui: {
                ...this.state.ui,
                [name]: value
            }
        }, () => {
            if (name === 'city') {
                this.onSetDefaultMode(value)
            }
        })
    }
    getKeys = () => this.onLoading(Api.getKeys, this.onKeysSuccess, this.onError)
    getStatistics = (city, mode) => {
        const query = {
            key: `${city}_${mode}_statistics.json`
        }

        this.onLoading(Api.getStatistics, query, this.onStatisticsSuccess, this.onError)
    }

    render() {
        return <Component
            {...this.state.data}
            {...this.state.ui}
            {...this.state.domain} />
    }
}
export default withDataFetching(TradeViewer)
