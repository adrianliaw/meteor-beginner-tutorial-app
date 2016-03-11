Messages = new Mongo.Collection('messages');

if (Meteor.isClient) {
    Template.Board.helpers({
        messages() {
            return Messages.find();
        },

        userDisplayName(userId) {
            let user = Meteor.users.findOne(userId);
            return user ? user.profile.name : 'An Anonymous Meteorite';
        },
    });

    Template.NewMessage.events({
        'submit #new-message': function(event, template) {
            event.preventDefault();
            Messages.insert({
                text: template.find('#message-text').value,
                authorId: Meteor.userId(),
                created: new Date(),
            });
            template.find('#message-text').value = '';
        },
    });
}

if (Meteor.isServer) {
    Meteor.startup(() => {
        if (Messages.findOne() === undefined) {
            Messages.insert({text: 'Hello world', created: new Date()});
            Messages.insert({text: 'Meteor rocks', created: new Date()});
        }
    });
}
