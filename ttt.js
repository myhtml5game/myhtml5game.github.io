var wnd = document.getElementById("main");
var ctx = wnd.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var fs = (wnd.width < wnd.height ? wnd.width : wnd.height) * 0.9;
var cs = fs * 0.96 / 3;
var ss = fs * 0.02;
var fx1 = (wnd.width - fs) / 2;
var fy1 = (wnd.height - fs) / 2;
var fx2 = fx1 + fs;
var fy2 = fy1 + fs;
var clrx = "#ff0000";
var clro = "#0000ff";

var cc = [[],[],[]];
for (x = 0; x < 3; x++)
{
    for (y = 0; y < 3; y++)
    {
        cc[x][y] =
        {
            x1: fx1+(cs+ss)*x,
            y1: fy1+(cs+ss)*y,
            x2: fx1+(cs+ss)*x+cs,
            y2: fy1+(cs+ss)*y+cs,
            st: 0
        };
    }
}

ctx.fillRect(cc[0][0].x2, cc[0][0].y1, ss, fs);
ctx.fillRect(cc[1][0].x2, cc[1][0].y1, ss, fs);
ctx.fillRect(cc[0][0].x1, cc[0][0].y2, fs, ss);
ctx.fillRect(cc[0][1].x1, cc[0][1].y2, fs, ss);
ctx.lineWidth = ss;

//
// ---------------------------------------------------------------------------
function ai_turn()
{
    var f = [];
    for (x = 0; x < 3; x++)
    {
        for (y = 0; y < 3; y++)
        {
            if (cc[x][y].st == 0) f.push(cc[x][y]);
        }
    }
    if (f.length > 0)
    {
        var i = Math.floor(Math.random() * f.length);
        f[i].st = 2;
        ctx.beginPath();
        ctx.arc(f[i].x1+cs/2, f[i].y1+cs/2, cs/2-ss, 0, 2*Math.PI);
        ctx.strokeStyle = clro;
        ctx.stroke();
        ctx.closePath();
    }
}

//
// ---------------------------------------------------------------------------
function is_game_over()
{
    if (!game_over)
    {
        if ((cc[0][0].st == cc[1][0].st) && (cc[1][0].st == cc[2][0].st))
        {
            if (cc[0][0].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][0].x1, cc[0][0].y1+cs/2);
                ctx.lineTo(cc[2][0].x2, cc[2][0].y1+cs/2);
                ctx.stroke();
            }
        }
        if ((cc[0][1].st == cc[1][1].st) && (cc[1][1].st == cc[2][1].st))
        {
            if (cc[0][1].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][1].x1, cc[0][1].y1+cs/2);
                ctx.lineTo(cc[2][1].x2, cc[2][1].y1+cs/2);
                ctx.stroke();
            }
        }
        if ((cc[0][2].st == cc[1][2].st) && (cc[1][2].st == cc[2][2].st))
        {
            if (cc[0][2].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][2].x1, cc[0][2].y1+cs/2);
                ctx.lineTo(cc[2][2].x2, cc[2][2].y1+cs/2);
                ctx.stroke();
            }
        }
        if ((cc[0][0].st == cc[0][1].st) && (cc[0][1].st == cc[0][2].st))
        {
            if (cc[0][0].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][0].x1+cs/2, cc[0][0].y1);
                ctx.lineTo(cc[0][2].x1+cs/2, cc[0][2].y2);
                ctx.stroke();
            }
        }
        if ((cc[1][0].st == cc[1][1].st) && (cc[1][1].st == cc[1][2].st))
        {
            if (cc[1][0].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[1][0].x1+cs/2, cc[1][0].y1);
                ctx.lineTo(cc[1][2].x1+cs/2, cc[1][2].y2);
                ctx.stroke();
            }
        }
        if ((cc[2][0].st == cc[2][1].st) && (cc[2][1].st == cc[2][2].st))
        {
            if (cc[2][0].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[2][0].x1+cs/2, cc[2][0].y1);
                ctx.lineTo(cc[2][2].x1+cs/2, cc[2][2].y2);
                ctx.stroke();
            }
        }
        if ((cc[0][0].st == cc[1][1].st) && (cc[1][1].st == cc[2][2].st))
        {
            if (cc[0][0].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][0].x1, cc[0][0].y1);
                ctx.lineTo(cc[2][2].x2, cc[2][2].y2);
                ctx.stroke();
            }
        }
        if ((cc[0][2].st == cc[1][1].st) && (cc[1][1].st == cc[2][0].st))
        {
            if (cc[0][2].st > 0)
            {
                game_over = true;
                ctx.moveTo(cc[0][2].x1, cc[0][2].y2);
                ctx.lineTo(cc[2][0].x2, cc[2][0].y1);
                ctx.stroke();
            }
        }
    }
    return game_over;
}

//
// ---------------------------------------------------------------------------
function handle_click(event)
{
    if (!game_over)
    {
        var x = event.clientX - ctx.canvas.getBoundingClientRect().left;
        var y = event.clientY - ctx.canvas.getBoundingClientRect().top;
        if ((x >= fx1) && (x <= fx2) && (y >= fy1) && (y <= fy2))
        {
            for (i = 0; i < 3; i++)
            {
                if (x < cc[i][0].x1) break;
                if (x > cc[i][0].x2) continue;
                for (j = 0; j < 3; j++)
                {
                    if (y < cc[0][j].y1) break;
                    if (y > cc[0][j].y2) continue;
                    if (cc[i][j].st == 0)
                    {
                        cc[i][j].st = 1;
                        ctx.beginPath();
                        ctx.moveTo(cc[i][j].x1+ss, cc[i][j].y1+ss);
                        ctx.lineTo(cc[i][j].x2-ss, cc[i][j].y2-ss);
                        ctx.moveTo(cc[i][j].x1+ss, cc[i][j].y2-ss);
                        ctx.lineTo(cc[i][j].x2-ss, cc[i][j].y1+ss);
                        ctx.strokeStyle = clrx;
                        ctx.stroke();
                        ctx.closePath();
                        if (is_game_over()) return;
                        ai_turn();
                        if (is_game_over()) return;
                    }
                }
            }
        }
    }
}

//
// ---------------------------------------------------------------------------
var game_over = false;
wnd.addEventListener("click", handle_click);
