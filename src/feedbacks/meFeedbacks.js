const { generateFeedback } = require('./utils')
const { option } = require('../actions/utils')
const { availability } = require('../switchers/types')

const feedbacksDefinitions = [
	{ id: 'me_preview', stateId: 'preview', name: 'me: Preview' },
	{ id: 'me_program', stateId: 'program', name: 'me: Program' },
]

const getFeedbackNames = () => feedbacksDefinitions.map(({ id }) => id)

const getFeedbacks = ({ context }) => {
	let feedbacks = {}

	feedbacksDefinitions.forEach(({ name, id, stateId }) => {
		feedbacks = {
			...feedbacks,
			[id]: generateFeedback({
				name,
				options: [
					option.videoSources({
						context,
						sources: context.switcher.videoSources,
						predicate: (source) => source.availability.source & availability.source.auxiliary,
					}),
					option.mixEffectBus(context),
				],
				callback: ({ options }) => {
					const meId = context.selectedOrValue('mix_effect_bus', options.mixEffectBus)
					const currentValue = context.getVariableValue(`me_${meId}_${stateId}`)
					context.log('debug', JSON.stringify({ option: options.videoSource, state: currentValue }))
					return options.videoSource === currentValue
				},
			}),
		}
	})

	return feedbacks
}

module.exports = {
	getFeedbacks,
	getFeedbackNames,
}
