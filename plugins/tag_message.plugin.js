/**
 * @name message_fix
 * @author Carson Young
 * @description Flips the orientation of the user's messages, placed a gradient
 * around "all" users' initial profile message, and applies the user's chosen
 * gradient to the toolbar and message helper buttons.
 * @version 0.0.1
 */

//hardcoded id's and gradient stops for ease
const user_ids = {
  "987969601470087168": {
    id: 1,
    stop1: "#3bcfd4",
    stop2: "#fc9305",
    stop3: "#f20094"
  },
  "238775339533336576": {
    id: 2,
    stop1: "#0097a7",
    stop2: "#3de0d2",
    stop3: "#00203f"
  },
  241200867364044800: {
    id: 3,
    stop1: "#1a2ac6",
    stop2: "#b21f1f",
    stop3: "#fdbb2d"
  },
  "748574569048178808": {
    id: 4,
    stop1: "#feaC5e",
    stop2: "#c779d0",
    stop3: "#4bc0c8"
  },
  "748319318101721119": {
    id: 5,
    stop1: "#3a1c71",
    stop2: "#d76d77",
    stop3: "#ffaf7b"
  },
  "772132734374117398": {
    id: 6,
    stop1: "#1a2ac6",
    stop2: "#b21f1f",
    stop3: "#fdbb2d"
  },
  "270085588978368514": {
    id: 7,
    stop1: "#1a2ac6",
    stop2: "#b21f1f",
    stop3: "#fdbb2d"
  }
};

//initialize an SVG element of type elem with attributes attr to be easily
//appended to other dom elements.
function init_SVG(elem, attr) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", elem);
  for (var set in attr) {
    svg.setAttribute(set, attr[set]);
  }
  return svg;
}

//helper function to return:
//              0 if message node does not exist
//              1 if message node does not contain a photo (follower message)
//              img[src] if message node does contain a photo (main message)
function get_img(node) {
  if (null == node) return 0;
  for (let i = 0; i < 3; i++) {
    if (node.firstChild === null) return 1;

    node = node.firstChild;
  }
  return node.getAttribute("src") || 1;
}

//makes the gradients that surround user profile messagess
function make_user_gradients(message, userdata, is_main_user) {
  if (!userdata) {
    return document.createElement("div");
  } else {
    //helper width of username and timestamp to make rectangle longer or shorter.
    var bounding_width =
      message.querySelector(".headerText-2z4IhQ").getBoundingClientRect()
        .width +
      message.querySelector(".timestamp-p1Df1m").getBoundingClientRect().width +
      73;

    //initialize base elements
    var defs = init_SVG("defs", {});
    var lin_grad_circ = init_SVG("linearGradient", {
      id: "gradient-user-circ-" + userdata.id
    });
    var lin_grad_rect = init_SVG("linearGradient", {
      id: "gradient-user-rect-" + userdata.id
    });

    //if main user, flip orientation of gradient rectangle
    //and gradient circle, as well as the gradient stops
    if (is_main_user) {
      var svg = init_SVG("svg", {
        class: "radial-box-user",
        height: 60,
        width: bounding_width
      });
      var grad_stop_1 = init_SVG("stop", {
        class: "stop-user-rect-1",
        offset: "0%",
        "stop-color": userdata.stop1
      });
      var grad_stop_2 = init_SVG("stop", {
        class: "stop-user-rect-2",
        offset: "100%",
        "stop-color": userdata.stop2
      });
      var grad_stop_3 = init_SVG("stop", {
        class: "stop-user-circ-1",
        offset: "0%",
        "stop-color": userdata.stop2
      });
      var grad_stop_4 = init_SVG("stop", {
        class: "stop-user-circ-2",
        offset: "100%",
        "stop-color": userdata.stop3
      });
      var rect_grad = init_SVG("rect", {
        class: "user-rect",
        width: bounding_width - 55,
        y: 28,
        fill: "url(#gradient-user-rect-" + userdata.id + ")"
      });
      var radial_grad = init_SVG("circle", {
        class: "user-radial",
        r: 25,
        cx: bounding_width - 30,
        cy: 30,
        stroke: "url(#gradient-user-circ-" + userdata.id + ")"
      });
    } else {
      var svg = init_SVG("svg", {
        class: "radial-box-non-user",
        height: 60,
        width: bounding_width
      });
      var grad_stop_3 = init_SVG("stop", {
        class: "stop-user-circ-1",
        offset: "0%",
        "stop-color": userdata.stop1
      });
      var grad_stop_4 = init_SVG("stop", {
        class: "stop-user-circ-2",
        offset: "100%",
        "stop-color": userdata.stop2
      });
      var grad_stop_1 = init_SVG("stop", {
        class: "stop-user-rect-1",
        offset: "0%",
        "stop-color": userdata.stop2
      });
      var grad_stop_2 = init_SVG("stop", {
        class: "stop-user-rect-2",
        offset: "100%",
        "stop-color": userdata.stop3
      });
      var rect_grad = init_SVG("rect", {
        class: "user-rect",
        width: bounding_width - 55,
        x: 55,
        y: 28,
        fill: "url(#gradient-user-rect-" + userdata.id + ")"
      });
      var radial_grad = init_SVG("circle", {
        class: "user-radial",
        r: 25,
        cx: 30,
        cy: 30,
        stroke: "url(#gradient-user-circ-" + userdata.id + ")"
      });
    }

    lin_grad_rect.appendChild(grad_stop_1);
    lin_grad_rect.appendChild(grad_stop_2);
    lin_grad_circ.appendChild(grad_stop_3);
    lin_grad_circ.appendChild(grad_stop_4);
    defs.appendChild(lin_grad_rect);
    defs.appendChild(lin_grad_circ);
    svg.appendChild(defs);
    svg.appendChild(rect_grad);
    svg.appendChild(radial_grad);

    return svg;
  }
}

//tagging user messages with userids, and whether a message is a main message or not
//as well as activating the profile gradients
function tag_user_message(messages, userdata) {
  for (let i = 0; i < messages.length; i++) {
    let user = get_img(messages[i]);

    //if main message
    if (user != 1) {
      //"https://cdn.discordapp.com/avatars/**987969601470087168**/15d7baae50a7aecd821e2ab054d25d34.webp?size=80"
      let id = user.slice(35, 53);

      //make user gradients
      if (messages[i].querySelector(".radial-box-user") === null) {
        messages[i].appendChild(
          make_user_gradients(
            messages[i],
            userdata[id],
            id == "987969601470087168"
          )
        );
      }

      //set attributes
      messages[i].setAttribute("user-id", id);
      messages[i].setAttribute("main-mes", 1);

      //increment and check if the next message is also a main message (different user)
      i++;
      user = get_img(messages[i]);

      //while user messages are follower messages
      while (user == 1) {
        //last node catch
        if (i >= messages.length - 1) {
          messages[i].setAttribute("user-id", id);
          break;
        }

        //set attribute, increment, and check if the next message is a main message or not
        messages[i].setAttribute("user-id", id);
        i++;
        user = get_img(messages[i]);
      }
      //so that the next main message gets caught and flagged above
      i--;
    }
  }
}

// helper function from before
//
// function wait_for_exists(dom) {
//   return new Promise((res) => {
//     if (document.querySelector(dom)) {
//       return res(document.querySelector(dom));
//     }

//     const observer = new MutationObserver((mutations) => {
//       if (document.querySelector(dom)) {
//         res(document.querySelector(dom));
//         observer.disconnect();
//       }
//     });

//     observer.observe(document.body, {
//       childList: true,
//       subtree: true
//     });
//   });
// }

module.exports = (meta) => ({
  start() {
    //most of this code runs and is functional but
    //it is quite buggy and sometimes will randomly
    //start phone calls?? and other strange quirks
    //that have quite literally nothing to do with
    //the API calls and function patching I'm doing.
    //
    // const MessageActions = BdApi.Webpack.getModule(
    //   BdApi.Webpack.Filters.byProps("jumpToMessage", "_sendMessage")
    // );
    // BdApi.Patcher.after(
    //   "receive-patch",
    //   MessageActions,
    //   "receiveMessage",
    //   (_, args) => {
    //     var messages = document.querySelectorAll(
    //       ".messageListItem-ZZ7v6g:not([user-id])"
    //     );
    //     if (
    //       messages.length != 0 &&
    //       messages[0].querySelector(".isSending-3SiDwE") !== null
    //     ) {
    //       if (messages[0].querySelector("img") !== null) {
    //         messages[0].firstChild.firstChild.firstChild.setAttribute(
    //           "style",
    //           "position: absolute; left: auto; right: 16px; clear: right;"
    //         );
    //       }
    //       messages[0].firstChild.setAttribute(
    //         "style",
    //         "margin-left: auto; padding-left: 48px; margin-right: 0; padding-right: 72px!important; text-align: right;"
    //       );
    //       BdApi.onRemoved(messages[0], () => {
    //         message_list = document.querySelectorAll(
    //           ".messageListItem-ZZ7v6g"
    //         );
    //         let elem = message_list[message_list.length - 1];
    //         elem.setAttribute("user-id", args[1].author.id);
    //         if (elem.querySelector("img") !== null) {
    //           elem.setAttribute("main-mes", 1);
    //           elem.appendChild(
    //             make_user_gradients(
    //               elem,
    //               user_ids["987969601470087168"],
    //               true
    //             )
    //           );
    //         }
    //       });
    //     } else if (messages.length != 0) {
    //       tag_user_message(messages, user_ids, args[1].author.id);
    //     }
    //   }
    // );
  },

  stop() {
    // BdApi.Patcher.unpatchAll("send-patch");
    // BdApi.Patcher.unpatchAll("receive-patch");
  },

  onSwitch() {
    //apply gradient circle/rect, and move
    //user messages to the opposite side of the screen.
    if (document.querySelector(".messageListItem-ZZ7v6g") !== null) {
      var messages = document.querySelectorAll(
        ".messageListItem-ZZ7v6g:not([user-id])"
      );
      tag_user_message(messages, user_ids);
    }

    //get each toolbar box and compute width
    //wrap each path in mask and make
    //gradient rectangle (shifted by 8, 48, 88, ...)
    //
    //this works for BOTH dm's and channels/servers
    if (document.querySelector(".toolbar-3_r2xA") !== null) {
      let buttons = document.querySelectorAll(
        ".toolbar-3_r2xA > .iconWrapper-2awDjA"
      );

      for (let i = 0; i < buttons.length; i++) {
        let id = "987969601470087168";

        let defs = init_SVG("defs", {});
        let mask = init_SVG("mask", {
          id: "toolbar-mask-" + i
        });
        let lin_grad_rect = init_SVG("linearGradient", {
          id: "gradient-toolbar-rect-" + i
        });
        let grad_stop_1 = init_SVG("stop", {
          class: "stop-user-rect-1",
          offset: "0%",
          "stop-color": user_ids[id].stop1
        });
        let grad_stop_2 = init_SVG("stop", {
          class: "stop-user-rect-2",
          offset: "50%",
          "stop-color": user_ids[id].stop2
        });
        let grad_stop_3 = init_SVG("stop", {
          class: "stop-user-rect-3",
          offset: "100%",
          "stop-color": user_ids[id].stop3
        });
        let rect = init_SVG("rect", {
          height: 24,
          width: 40 * buttons.length,
          x: -8 - 40 * i,
          fill: "url(#gradient-toolbar-rect-" + i + ")",
          mask: "url(#toolbar-mask-" + i + ")"
        });

        let num_paths = buttons[i].querySelectorAll("svg > path").length;

        if (buttons[i].querySelector("foreignObject") !== null) {
          let path = buttons[i].firstChild.firstChild.firstChild.removeChild(
            buttons[i].firstChild.firstChild.firstChild.firstChild
          );
          mask.appendChild(path);
        } else {
          for (let j = 0; j < num_paths; j++) {
            let path = buttons[i].firstChild.removeChild(
              buttons[i].firstChild.firstChild
            );
            mask.appendChild(path);
          }
        }

        lin_grad_rect.appendChild(grad_stop_1);
        lin_grad_rect.appendChild(grad_stop_2);
        lin_grad_rect.appendChild(grad_stop_3);
        defs.appendChild(lin_grad_rect);
        buttons[i].firstChild.appendChild(defs);
        buttons[i].firstChild.appendChild(mask);
        buttons[i].firstChild.appendChild(rect);
      }
    }

    //primarily the same as above but for the message bar
    //icons don't change so we only need the three
    if (document.querySelector(".buttons-uaqb-5") !== null) {
      let buttons = document.querySelectorAll(".buttons-uaqb-5 svg");
      for (let i = 0; i < buttons.length; i++) {
        let id = "987969601470087168";
        let path = buttons[i].removeChild(buttons[i].firstChild);

        let defs = init_SVG("defs", {});
        let mask = init_SVG("mask", {
          id: "messagebar-mask-" + i
        });
        let lin_grad_rect = init_SVG("linearGradient", {
          id: "gradient-messagebar-rect-" + i
        });
        let grad_stop_1 = init_SVG("stop", {
          class: "stop-user-rect-1",
          offset: "0%",
          "stop-color": user_ids[id].stop1
        });
        let grad_stop_2 = init_SVG("stop", {
          class: "stop-user-rect-2",
          offset: "50%",
          "stop-color": user_ids[id].stop2
        });
        let grad_stop_3 = init_SVG("stop", {
          class: "stop-user-rect-3",
          offset: "100%",
          "stop-color": user_ids[id].stop3
        });
        let rect = init_SVG("rect", {
          height: 24,
          width: 40 * buttons.length,
          x: -8 - 40 * i,
          fill: "url(#gradient-toolbar-rect-" + i + ")",
          mask: "url(#messagebar-mask-" + i + ")"
        });
        if (buttons[i].firstChild !== null) {
          let extra_path = buttons[i].removeChild(buttons[i].firstChild);
          mask.appendChild(extra_path);
        }
        lin_grad_rect.appendChild(grad_stop_1);
        lin_grad_rect.appendChild(grad_stop_2);
        lin_grad_rect.appendChild(grad_stop_3);
        mask.appendChild(path);
        defs.appendChild(lin_grad_rect);
        buttons[i].appendChild(defs);
        buttons[i].appendChild(mask);
        buttons[i].appendChild(rect);
      }
    }
  }
});
