export function notFound(req, res, next) {
    const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  }
  
  export function errorHandler(err, req, res, next) {
    console.error('🔥 Erro capturado:', err);
  
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor.';
  
    res.status(statusCode).json({
      success: false,
      message,
      error: err.stack
    });
  }
  