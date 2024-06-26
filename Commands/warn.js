const {
    Client,
    Message,
    EmbedBuilder,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    Guild,
    GuildMember,
    PermissionsBitField,
} = require('discord.js')

const db = require('quick.db');

const { SlashCommandBuilder, userMention } = require('@discordjs/builders')


module.exports = {
    name: 'Warn',
    description: 'Warn a member in the Discord Server!',
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member in the Discord Server!')
    .addUserOption(option =>
        option.setName('username')
        .setDescription('User to Warn').setRequired(true)
        )
    .addStringOption(option =>
        option.setName('reason')
        .setDescription('Reason for Warn')),
        /**
         * 
         * @param {Client} bot
         * @param {Message} message
         * @param {String[]} args
         */
        async execute(bot, message, args) {},

        /**
         * 
         * @param {Client} bot
         * @param {CommandInteraction} interaction
         */
        async slashexecute(bot, interaction) {
          let serversetup = bot.db.get(`ServerSetup_${interaction.guild.id}`)
            await interaction.deferReply({ephemeral: true});
            if (!serversetup) return interaction.editReply(`:x: **ERROR** | This server hasn't been setup. Please ask the Owner to setup the bot for this server!`)
            const username = interaction.options.getUser('username');
            const reason = interaction.options.getString('reason') || "No Reason Provided!";
            try {
              let user = interaction.guild.members.cache.get(username.id);
                if (username && reason) {
                  if (interaction.member.user === username) return interaction.editReply(`:x: **ERROR** | You can't Warn yourself!\n**This message will Auto-Delete in 10 seconds!**`).then(
                  setTimeout(() => {
                    interaction.deleteReply().catch(() => {
                      return;
                    })
                }, 10000)
                  )
                  if (bot.user === username) return interaction.editReply(`:x: **ERROR** | You can't Warn me!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {
                        return;
                      })
                  }, 10000)
                    )
                  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.editReply(`:x: **ERROR** | You don't have permission to use this command!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {
                        return;
                      })
                  }, 10000)
                    )
                  if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.editReply(`:x: **ERROR** | I don't have permission to execute this command!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {
                        return;
                      })
                  }, 10000)
                    )
                  if (username.moderatable) return interaction.editReply(`:x: **ERROR** | I can't warn ${username} because they have higher permission levels over me!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {
                        return;
                      })
                  }, 10000)
                    )
                  if (interaction.member.user.bot = username.bot) return interaction.editReply(`:x: **ERROR** | You can't Warn other Bots!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                      interaction.deleteReply().catch(() => {
                        return;
                      })
                  }, 10000)
                    )
                    if (interaction.guild.members.me.roles.highest.position < user.roles.highest.position) return interaction.editReply(`:x: **ERROR** | I can't Warn ${username} because they have higher permission levels over me!\n**This message will Auto-Delete in 10 seconds!**`).then(
                      setTimeout(() => {
                          interaction.deleteReply().catch(() => {
                            return;
                          })
                      }, 10000)
                  )
                  if (interaction.member.roles.highest.position < user.roles.highest.position) return interaction.editReply(`:x: **ERROR** | You can't Warn ${username} because they are a Higher Rank than you!\n**This message will Auto-Delete in 10 seconds!**`).then(
                    setTimeout(() => {
                        interaction.deleteReply().catch(() => {
                          return;
                        })
                    }, 10000)
                )

            bot.db.set(`userWarnings_${interaction.guild.id}_${username.id}.userid`, interaction.member.id)
          bot.db.add(`userWarnings_${interaction.guild.id}_${username.id}.warnings`, 1);
          bot.db.push(`userWarnings_${interaction.guild.id}_${username.id}.reasons`, reason);
                interaction.editReply({ content: `:white_check_mark: **SUCCESS** | Successfully Warned **${username}** in the ${interaction.guild.name} Server!\n**This message will Auto-Delete in 10 seconds!**`,
            }).then(
            setTimeout(() => {
                interaction.deleteReply().catch(() => {
                  return;
                })
            }, 10000)
            )
              let embed = new EmbedBuilder()
                  .setColor("Yellow")
                  .setTitle(`**Moderation Report**`)
                  .setDescription(`**Username:**\n${username.username}\n**Discriminator:**\n${username.discriminator}\n**User Tag:**\n${username.tag}\n**User Mention:**\n${username}\n**UserId:**\n${username.id}\n**Moderation Type:**\nWarn\n**Reason:**\n${reason}\n**Moderator:**`)
                  .setAuthor({ name: username.username, iconURL: username.displayAvatarURL()})
                  .setFooter({ text: `${interaction.member.user.username} | This message will Auto-Delete in 5 seconds!`, iconURL: interaction.member.user.displayAvatarURL() })
                  .setTimestamp(Date.now());
                  interaction.channel.send({ embeds: [embed] }).then(message => {
                  setTimeout(() => {
                    message.delete().catch(() => {
                      return;
                    })
                }, 5000)
            })
                  } else {
                interaction.editReply({ content: `:x: **ERROR** | Failed to Warn **${username}** in the ${interaction.guild.name} Server!\n**This message will Auto-Delete in 10 seconds!**`,
        }).then(
        setTimeout(() => {
            interaction.deleteReply().catch(() => {
              return;
            })
        }, 10000)
        )
        }
            } catch (error) {
                console.log(error.message)
            }
        },
}
