
const Models = {


	$models: {},

	registerModel : function (name, model) {
		this.$models[name] = model
	},

	createModel : async function (config) {

		const modelAdapter = config.model.adapter || 'sushi'


		const db = await this.getDatabaseAdapter(modelAdapter)

		let relations = []
		if( config.model.relations )  {
			relations = config.model.relations
		
			if ( config.model.relations.call ) {
				relations = config.model.relations( db )
			}
		}
		
		const modelConfig = {
			schema: config.model.schema,
			relations
		}

		const [ model, collection ] = await db.createModel(config.name, modelConfig)
		model.collection = collection
		
		this.registerModel(config.name, model)
		this.registerModel(config.name + 's', collection)

		return model
	}
}

module.exports = function Installer( App ) {

    App.models = Models

    return App

}