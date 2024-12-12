export function clearCookie(res, cookieName) {
  res.cookie(cookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    expires: new Date(0),
  })
}
