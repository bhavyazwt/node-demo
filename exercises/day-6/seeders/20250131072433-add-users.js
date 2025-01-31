"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     
    */
    await queryInterface.bulkInsert(
      "User",
      [
        {
          name: "Steffen",
          email: "sduggan0@mapquest.com",
          role: "Admin",
          age: 1,
          isActive: false,
        },
        {
          name: "Reine",
          email: "rlesper1@mozilla.org",
          role: "Admin",

          age: 2,
          isActive: false,
        },
        {
          name: "Erinn",
          email: "eroman2@privacy.gov.au",
          role: "Admin",

          age: 3,
          isActive: false,
        },
        {
          name: "Devora",
          email: "dsolesbury3@statcounter.com",
          role: "Admin",

          age: 4,
          isActive: false,
        },
        {
          name: "Matthiew",
          email: "mdebeauchemp4@ucsd.edu",
          role: "Admin",

          age: 5,
          isActive: false,
        },
        {
          name: "Jervis",
          email: "jscyner5@over-blog.com",
          role: "Admin",

          age: 6,
          isActive: false,
        },
        {
          name: "Bibbie",
          email: "brampley6@gmpg.org",
          role: "Admin",

          age: 7,
          isActive: false,
        },
        {
          name: "Mira",
          email: "mhutton7@mashable.com",
          role: "Admin",

          age: 8,
          isActive: true,
        },
        {
          name: "Andrus",
          email: "afaire8@hhs.gov",
          age: 9,
          role: "Admin",
          isActive: false,
        },
        {
          name: "Hamnet",
          email: "hsawle9@istockphoto.com",
          age: 10,
          role: "Admin",

          isActive: false,
        },
        {
          name: "Guendolen",
          email: "gkolinskya@loc.gov",
          role: "Admin",

          age: 11,
          isActive: true,
        },
        {
          name: "Tudor",
          email: "tiwanickib@tripadvisor.com",
          role: "Admin",

          age: 12,
          isActive: false,
        },
        {
          name: "Darren",
          email: "dfidelusc@vimeo.com",
          role: "Admin",

          age: 13,
          isActive: true,
        },
        {
          name: "Elfrieda",
          email: "edanzelmand@marriott.com",
          role: "Admin",

          age: 14,
          isActive: true,
        },
        {
          name: "Orel",
          email: "ovallise@state.gov",
          role: "Admin",

          age: 15,
          isActive: false,
        },
        {
          name: "Harland",
          email: "hduckerf@wisc.edu",
          role: "Admin",

          age: 16,
          isActive: true,
        },
        {
          name: "Mara",
          email: "mhuishg@ebay.com",
          age: 17,
          role: "User",
          isActive: true,
        },
        {
          name: "Colette",
          email: "coshavlanh@newyorker.com",
          age: 18,
          role: "User",
          isActive: true,
        },
        {
          name: "Calla",
          email: "cmcbeithi@stanford.edu",
          role: "User",
          age: 19,
          isActive: false,
        },
        {
          name: "Mohammed",
          email: "mjirieckj@squarespace.com",
          role: "User",
          age: 20,
          isActive: true,
        },
        {
          name: "Huntley",
          email: "hkehirk@quantcast.com",
          role: "User",
          age: 21,
          isActive: true,
        },
        {
          name: "Boycie",
          email: "bgreensmithl@instagram.com",
          role: "User",
          age: 22,
          isActive: false,
        },
        {
          name: "Jojo",
          email: "jperrinm@wix.com",
          age: 23,
          role: "User",
          isActive: true,
        },
        {
          name: "Atlante",
          email: "apavian@simplemachines.org",
          role: "User",
          age: 24,
          isActive: false,
        },
        {
          name: "Dag",
          email: "dastletto@amazon.co.jp",
          age: 25,
          role: "User",
          isActive: false,
        },
        {
          name: "Bernardine",
          email: "bbreadmorep@telegraph.co.uk",
          role: "User",
          age: 26,
          isActive: false,
        },
        {
          name: "Lanie",
          role: "User",
          email: "liacovoloq@hatena.ne.jp",
          age: 27,
          isActive: true,
        },
        {
          name: "Randy",
          email: "rfittr@guardian.co.uk",
          role: "User",
          age: 28,
          isActive: false,
        },
        {
          name: "Ginger",
          email: "gwoolfendens@miibeian.gov.cn",
          role: "User",
          age: 29,
          isActive: false,
        },
        {
          name: "Roberta",
          email: "rgabelt@comsenz.com",
          role: "User",
          age: 30,
          isActive: true,
        },
        {
          name: "Drucy",
          email: "deacleu@godaddy.com",
          role: "User",
          age: 31,
          isActive: true,
        },
        {
          name: "Nollie",
          email: "nguillotv@is.gd",
          role: "User",
          age: 32,
          isActive: true,
        },
        {
          name: "Babita",
          email: "bbridgnellw@google.pl",
          role: "User",
          age: 33,
          isActive: false,
        },
        {
          name: "Xenos",
          email: "xbedlex@umich.edu",
          role: "User",
          age: 34,
          isActive: true,
        },
        {
          name: "Lay",
          email: "lschusterly@yahoo.com",
          role: "User",
          age: 35,
          isActive: true,
        },
        {
          name: "Base",
          email: "bburnhillz@boston.com",
          role: "User",
          age: 36,
          isActive: true,
        },
        {
          name: "Shawna",
          email: "srelph10@shinystat.com",
          role: "User",
          age: 37,
          isActive: true,
        },
        {
          name: "Florentia",
          email: "flofts11@gizmodo.com",
          role: "User",
          age: 38,
          isActive: false,
        },
        {
          name: "Emlen",
          email: "eminnis12@accuweather.com",
          role: "User",
          age: 39,
          isActive: false,
        },
        {
          name: "Gearard",
          email: "gcescot13@xing.com",
          role: "User",
          age: 40,
          isActive: true,
        },
        {
          name: "Hershel",
          email: "hlitherborough14@skype.com",
          role: "User",
          age: 41,
          isActive: true,
        },
        {
          name: "Eugen",
          email: "eharrowsmith15@businessweek.com",
          role: "User",
          age: 42,
          isActive: true,
        },
        {
          name: "Basil",
          email: "bhedan16@blogger.com",
          role: "User",
          age: 43,
          isActive: true,
        },
        {
          name: "Cleveland",
          email: "ckuhnhardt17@hexun.com",
          role: "User",
          age: 44,
          isActive: true,
        },
        {
          name: "Robbi",
          email: "redyson18@imdb.com",
          role: "User",
          age: 45,
          isActive: true,
        },
        {
          name: "Ashleigh",
          email: "atheyer19@reddit.com",
          role: "User",
          age: 46,
          isActive: false,
        },
        {
          name: "Dinny",
          email: "dstolle1a@youku.com",
          role: "User",
          age: 47,
          isActive: false,
        },
        {
          name: "Reggi",
          email: "rtandey1b@cbsnews.com",
          role: "User",
          age: 48,
          isActive: false,
        },
        {
          name: "Ryon",
          email: "rbrockley1c@redcross.org",
          role: "User",
          age: 49,
          isActive: true,
        },
        {
          name: "Waylan",
          email: "wbrokenshaw1d@google.ca",
          role: "User",
          age: 50,
          isActive: false,
        },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("User", null, {});
  },
};
